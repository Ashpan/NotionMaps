import axios from "axios";
import GoogleMapReact from "google-map-react";
import { useEffect, useState } from "react";
import { SERVER_OPTIONS, TORONTO_CENTER } from "../constants";
import { BlueMarkerIcon, CurrentLocationMarkerIcon, GreenMarkerIcon, PinkMarkerIcon, PurpleMarkerIcon, RedMarkerIcon } from "./Marker";
import MapSkeleton from "./MapSkeleton";

let markers = [];
let infoWindows = [];

const LocationMap = ({ filters, selectedFilters }) => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCenter, setCurrentCenter] = useState(TORONTO_CENTER);
  const [map, setMap] = useState(null);
  const [maps, setMaps] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCurrentCenter({ lat, lng });
          setCurrentLocation({ lat, lng});
          if(map) {
            map.setCenter({ lat, lng });
            map.setZoom(16);
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const axiosInstance = axios.create({
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

  useEffect(() => {
    axiosInstance
      .request(SERVER_OPTIONS())
      .then(function async(response) {
        setLocations(response.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.error(error);
        setIsLoading(false); // Stop loading even if there's an error
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterLocations = (location, selectedFilters) => {
    // Check each filter category
    for (const category in selectedFilters) {
      const selectedOptions = selectedFilters[category];
      const locationOptions = location[category].map((opt) => opt.name);
      if (
        selectedOptions.length === 0 ||
        selectedOptions.some((selectedOption) =>
          locationOptions.includes(selectedOption)
        )
      ) {
        continue;
      }

      // If no option in the category matches, return false
      return false;
    }

    // If all categories have at least one match, return true
    return true;
  };

  const filteredLocations = locations.filter((location) =>
    filterLocations(location, selectedFilters)
  );
  useEffect(() => {
    if (!isLoading && map && maps) {
      handleApiLoaded(map, maps, filteredLocations, filters);
    }
  }, [filteredLocations, isLoading, map, maps]);

  useEffect(() => {
    if (currentLocation && map && maps) {
      const marker = new maps.Marker({
        position: currentLocation,
        map,
        icon: CurrentLocationMarkerIcon(maps)
      });
      markers.push(marker)
    }
  }, [currentLocation, map, maps]);

  // Show skeleton while locations are loading
  if (isLoading) {
    return <MapSkeleton />;
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: `${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
        }}
        center={currentCenter}
        defaultZoom={13}
        yesIWantToUseGoogleMapApiInternals
        options={{ gestureHandling: "greedy" }}
        onGoogleApiLoaded={({ map: loadedMap, maps: loadedMaps }) => {
          setMap(loadedMap);
          setMaps(loadedMaps);
        }}
      />
      <button className="current-location-button" onClick={getCurrentLocation}>
        &#8982;
      </button>
    </div>
  );
};

const handleApiLoaded = (map, maps, locations, filters) => {
  markers.forEach((marker) => marker.setMap(null));
  infoWindows.forEach((infoWindow) => infoWindow.close());

  markers = [];
  infoWindows = [];
  let currentInfoWindow = null;

  locations.forEach((location) => {
    let markerIcon = RedMarkerIcon(maps);
    for(const filter in filters) {
      if(location[filter].length > 0) {
        switch (location[filter][0].colour){
          case "blue":
            markerIcon = BlueMarkerIcon(maps);
            break;
          case "green":
            markerIcon = GreenMarkerIcon(maps);
            break;
          case "red":
            markerIcon = RedMarkerIcon(maps);
            break;
          case "pink":
            markerIcon = PinkMarkerIcon(maps);
            break;
          case "purple":
            markerIcon = PurpleMarkerIcon(maps);
            break;
        }
      }
    }
    const marker = new maps.Marker({
      position: {
        lat: location.lat,
        lng: location.long,
      },
      map,
      icon: markerIcon
    });
    const infoWindow = new maps.InfoWindow({
      content: getInfoWindowString(location, filters),
    });

    marker.addListener("click", () => {
      if (currentInfoWindow) {
        currentInfoWindow.close();
      }

      infoWindow.open(map, marker);
      currentInfoWindow = infoWindow;
    });

    markers.push(marker);
    infoWindows.push(infoWindow);
  });
};

const getInfoWindowString = (place, filters) => `
    <div>
      <div style="font-size: 16px; color: black;">
        <a href="${place.url}" target="_blank"><u>${place.name}</u></a>
      </div>
      <div style="font-size: 14px; color: grey;">
        ${place.rating} ⭐️ • ${"$".repeat(place.price)}
      </div>
      </hr>
      ${place.notes}
      ${Object.keys(filters)
        .map((filter) => {
          const categories = place[filter].map((opt) => opt.name)
          if (place[filter] && place[filter].length > 0) {
            return `
            <div style="font-size: 14px; color: grey;">
              ${categories.join(" • ")}
            </div>
          `;
          }
        })
        .join("")}
    </div>
  </div>`;
export default LocationMap;
