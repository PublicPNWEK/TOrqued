import { getSecret as getAWS, setSecret as setAWS } from './secrets_aws.js';
import { getSecret as getGCP, setSecret as setGCP } from './secrets_gcp.js';

const PROVIDER = process.env.SECRETS_PROVIDER || 'aws';

export async function getSecret(name) {
  return PROVIDER === 'gcp' ? getGCP(name) : getAWS(name);
}

export async function setSecret(name, value) {
  return PROVIDER === 'gcp' ? setGCP(name, value) : setAWS(name, value);
}
