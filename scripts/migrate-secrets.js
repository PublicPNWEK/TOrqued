#!/usr/bin/env node
const fs = require('fs')
const dotenv = require('dotenv')
const { argv } = require('process')
const use = argv.find(a=>a.startsWith('--provider='))?.split('=')[1] || 'aws'
const env = dotenv.parse(fs.readFileSync('.env'))
async function pushAWS(name, value) {
  const { SecretsManagerClient, CreateSecretCommand, PutSecretValueCommand } = require('@aws-sdk/client-secrets-manager')
  const client = new SecretsManagerClient({ region: process.env.AWS_REGION || 'us-east-1' })
  try { await client.send(new CreateSecretCommand({ Name: name, SecretString: value })) } catch (e) { if (e.name==='ResourceExistsException') await client.send(new PutSecretValueCommand({ SecretId: name, SecretString: value })) else throw e }
}
async function pushGCP(name, value) {
  const { SecretManagerServiceClient } = require('@google-cloud/secret-manager')
  const client = new SecretManagerServiceClient()
  const project = process.env.GCP_PROJECT
  const parent = `projects/${project}`
  try { await client.createSecret({ parent, secretId: name, secret: { replication: { automatic: {} } } }) } catch(e){ if(!/already exists/.test(e.message)) throw e }
  await client.addSecretVersion({ parent: `${parent}/secrets/${name}`, payload: { data: Buffer.from(value) } })
}
;(async ()=>{ for (const [k,v] of Object.entries(env)) { if(!v) continue; const name = `torqued_${k}`; if(use==='aws') await pushAWS(name,v); else await pushGCP(name,v) } console.log('done') })()
