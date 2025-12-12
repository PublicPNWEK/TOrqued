import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();
const project = process.env.GCP_PROJECT_ID;

function serializeSecret(value) {
  return JSON.stringify(value);
}

function deserializeSecret(data) {
  return JSON.parse(data.toString());
}

export async function getSecret(name) {
  const [version] = await client.accessSecretVersion({
    name: `projects/${project}/secrets/${name}/versions/latest`
  });
  return deserializeSecret(version.payload.data);
}

export async function setSecret(name, value) {
  const parent = `projects/${project}/secrets/${name}`;
  const payload = {
    data: Buffer.from(serializeSecret(value))
  };
  await client.addSecretVersion({ parent, payload });
}
