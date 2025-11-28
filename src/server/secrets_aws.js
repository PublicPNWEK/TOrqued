const { SecretsManagerClient, CreateSecretCommand, PutSecretValueCommand, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager')
const client = new SecretsManagerClient({ region: process.env.AWS_REGION || 'us-east-1' })
exports.getSecret = async function getSecret(name) { const res = await client.send(new GetSecretValueCommand({ SecretId: name })); if (res.SecretString) return JSON.parse(res.SecretString); return null }
exports.setSecret = async function setSecret(name, value) { try { await client.send(new CreateSecretCommand({ Name: name, SecretString: JSON.stringify(value) })) } catch (e) { if (e.name==='ResourceExistsException') await client.send(new PutSecretValueCommand({ SecretId: name, SecretString: JSON.stringify(value) })) else throw e } }
