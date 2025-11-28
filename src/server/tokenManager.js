import fetch from 'node-fetch';
import { getSecret, setSecret } from './secrets.js';

export async function getAccessToken() {
  const meta = await getSecret('torqued_tokens');
  const now = Date.now();

  if (meta?.accessToken && meta.expiresAt > now + 10000) return meta.accessToken;

  const res = await fetch(process.env.OAUTH_REFRESH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: meta.refreshToken
    })
  });

  const json = await res.json();
  const newMeta = {
    accessToken: json.access_token,
    refreshToken: json.refresh_token || meta.refreshToken,
    expiresAt: Date.now() + json.expires_in * 1000
  };

  await setSecret('torqued_tokens', newMeta);
  return newMeta.accessToken;
}
