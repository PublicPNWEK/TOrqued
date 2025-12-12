const { SecretsManagerClient, CreateSecretCommand, PutSecretValueCommand, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager')

const client = new SecretsManagerClient({ region: process.env.AWS_REGION || 'us-east-1' })

function serializeSecret(value) {
  return JSON.stringify(value);
}

function deserializeSecret(secretString) {
  return secretString ? JSON.parse(secretString) : null;
}

exports.getSecret = async function getSecret(name) {
  const res = await client.send(new GetSecretValueCommand({ SecretId: name }));
  return deserializeSecret(res.SecretString);
}

exports.setSecret = async function setSecret(name, value) {
  const secretString = serializeSecret(value);
  try {
    await client.send(new CreateSecretCommand({ Name: name, SecretString: secretString }))
  } catch (e) {
    if (e.name === 'ResourceExistsException') {
      await client.send(new PutSecretValueCommand({ SecretId: name, SecretString: secretString }))
    } else {
      throw e;
    }
  }
}
