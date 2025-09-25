import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import axios from 'axios';
import supabase from '../../lib/supabase';
import { setUserNotionSecretOptions } from '../../lib/notion';

export default withApiAuthRequired(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = getSession(req, res);
    const userId = session?.user?.name;
    const { code, databaseId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID not found in session' });
    }

    if (!code || !databaseId) {
      return res.status(400).json({ error: 'Missing required fields: code, databaseId' });
    }

    const axiosInstance = axios.create({
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    const response = await axiosInstance.request(setUserNotionSecretOptions(code));
    const access_token = response.data.access_token;

    const { error: insertError } = await supabase.from("user_keys").insert({
      user_id: userId,
      api_secret: access_token,
      database_id: databaseId,
    });

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return res.status(500).json({ error: 'Error occurred while inserting user token' });
    }

    return res.status(204).end();
  } catch (error) {
    console.error('Token exchange error:', error);
    return res.status(500).json({ error: error.message || 'Token exchange failed' });
  }
});