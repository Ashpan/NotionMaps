import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import supabase from '../../lib/supabase';

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

    const { data: userToken, error } = await supabase
      .from("user_keys")
      .select()
      .eq("user_id", userId);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Error occurred while fetching user token' });
    }

    if (userToken.length === 0) {
      return res.json({ exists: false });
    } else {
      return res.json({ exists: true });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});