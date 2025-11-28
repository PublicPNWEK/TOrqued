/** Simple WebSocket server for real-time affiliate events */
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: process.env.WS_PORT || 8081 })

wss.on('connection', (ws) => {
  console.log('ws: client connected')
  ws.on('message', (msg) => {
    console.log('ws recv', msg.toString())
    ws.send(JSON.stringify({ type: 'ack', payload: msg.toString() }))
  })
})

console.log('WebSocket server running on port', process.env.WS_PORT || 8081)
