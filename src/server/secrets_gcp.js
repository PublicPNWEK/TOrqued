import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
const client = new SecretManagerServiceClient();
const project = process.env.GCP_PROJECT_ID;

export async function getSecret(name) {
  const [version] = await client.accessSecretVersion({
    name: `projects/${project}/secrets/${name}/versions/latest`
  });
  return JSON.parse(version.payload.data.toString());
}

export async function setSecret(name, value) {
  const parent = `projects/${project}/secrets/${name}`;
  const payload = {
    data: Buffer.from(JSON.stringify(value))
  };
  await client.addSecretVersion({ parent, payload });
}
