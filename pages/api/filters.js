import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import axios from 'axios';
import supabase from '../../lib/supabase';
import { getUserApiKeyDatabaseId, getUserFilters, getFilterChoices } from '../../lib/database';
import { getDatabaseConfigOptions } from '../../lib/notion';

export default withApiAuthRequired(async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession(req, res);
    const userId = session?.user?.name;

    if (!userId) {
      return res.status(400).json({ error: 'User ID not found in session' });
    }

    const userData = await getUserApiKeyDatabaseId(supabase, userId);
    const { filters } = await getUserFilters(supabase, userId);

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

    const response = await axiosInstance.request(getDatabaseConfigOptions(databaseId, apiKey));

    const processedFilters = {};
    filters.map((filter) => {
      const filterProperties = response.data.properties[filter];
      processedFilters[filter] = getFilterChoices(filterProperties.type, filterProperties);
    });

    return res.json(processedFilters);
  } catch (error) {
    console.error('Filters API error:', error);
    return res.status(500).json({ error: 'Error occurred while fetching database config options' });
  }
});