import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import axios from 'axios';
import supabase from '../../lib/supabase';
import {
  getUserApiKeyDatabaseId,
  getUserFilters,
  getColNames,
  getLocationFilterChoices
} from '../../lib/database';
import {
  getDatabaseOptions,
  getIncompleteDatabaseOptions,
  getMapPlaceIdOptions,
  getMapOptions,
  patchDatabaseOptions
} from '../../lib/notion';

export default withApiAuthRequired(async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession(req, res);
    const userId = session?.user?.name;
    console.log('User ID:', userId);
    if (!userId) {
      return res.status(400).json({ error: 'User ID not found in session' });
    }

    const userData = await getUserApiKeyDatabaseId(supabase, userId);
    const columnsNames = await getColNames(supabase, userId);
    const { data: colourRes, error } = await supabase
      .from("user_keys")
      .select("colours")
      .eq("user_id", userId);

    const colours = colourRes[0].colours;

    if (!userData) {
      return res.status(500).json({ error: 'Error occurred while fetching user token' });
    }

    const { apiKey, databaseId } = userData;
    const axiosInstance = axios.create({
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    const formattedLocations = [];

    // First, process incomplete locations to enrich with Google Maps data
    const incompleteResponse = await axiosInstance.request(
      getIncompleteDatabaseOptions(databaseId, apiKey, columnsNames)
    );

    const incompleteLocations = incompleteResponse.data.results;

    // Process incomplete locations with Google Maps API
    for (const location of incompleteLocations) {
      if (location.properties === undefined) {
        continue;
      }

      if (
        location.properties[columnsNames.address].rich_text[0]?.text?.content === "" ||
        location.properties[columnsNames.name].title[0]?.plain_text === ""
      ) {
        continue;
      }

      try {
        const placeResponse = await axiosInstance.request(
          getMapPlaceIdOptions(
            encodeURIComponent(
              location.properties[columnsNames.name].title[0].plain_text +
                ", " +
                location.properties[columnsNames.address].rich_text[0].text.content
            )
          )
        );

        if (placeResponse.data.status !== "OK") {
          continue;
        }

        const detailsResponse = await axiosInstance.request(
          getMapOptions(placeResponse.data.candidates[0].place_id)
        );

        const responseJSON = detailsResponse.data.result;
        const { lat, lng } = responseJSON.geometry.location;
        const price = responseJSON.price_level || 0;
        const rating = responseJSON.rating;
        const pageId = location.id;
        const url = responseJSON.url;

        await axiosInstance.request(
          patchDatabaseOptions(
            pageId,
            lat,
            lng,
            price,
            rating,
            url,
            apiKey
          )
        );
      } catch (error) {
        console.error('Error processing incomplete location:', error);
        // Continue with other locations
      }
    }

    // Now fetch all locations (including the newly enriched ones)
    let locations = [];
    let nextCursor = undefined;
    const { filters } = await getUserFilters(supabase, userId);

    do {
      const response = await axiosInstance.request(
        getDatabaseOptions(databaseId, apiKey, nextCursor)
      );

      const responseData = response.data;
      nextCursor = responseData.next_cursor;
      locations = [...locations, ...responseData.results];
    } while (nextCursor);

    // Process all locations for frontend
    for (const location of locations) {
      if (location.properties === undefined) {
        continue;
      }

      let notes;
      try {
        notes = location.properties[columnsNames.notes].rich_text[0]?.text?.content || "-";
      } catch (error) {
        notes = "-";
      }

      try {
        let locationMetadata = {
          name: location.properties[columnsNames.name].title[0]?.text?.content,
          lat: parseFloat(location.properties[columnsNames.latitude].number),
          long: parseFloat(location.properties[columnsNames.longitude].number),
          price: location.properties[columnsNames.price].number,
          rating: location.properties[columnsNames.rating].number,
          notes: notes,
          url: location.properties[columnsNames.mapsLink].url,
        };

        filters.map((filter) => {
          const filterProperties = location.properties[filter];
          locationMetadata[filter] = getLocationFilterChoices(
            filterProperties.type,
            filterProperties,
            filter,
            colours[filter]
          );
        });

        formattedLocations.push(locationMetadata);
      } catch (error) {
        console.error('Error processing location:', error);
        // Continue with other locations
      }
    }

    return res.json(formattedLocations);
  } catch (error) {
    console.error('Locations API error:', error);
    return res.status(500).json({ error: 'Error occurred while fetching locations' });
  }
});