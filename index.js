const Cryptr = require('cryptr');
const cryptr = new Cryptr('beastcraft');

const WebSocket = require("ws")
const peers = {}
const wss = new WebSocket.Server({
      port: 3028
})

wss.on('connection', (socket, req) => {
      socket.on("message", (stream) => {
            const msgString = Buffer.from(stream).toString()
            response = JSON.parse(msgString)
            if (response.event == "connect") {
                  const peerId = req.socket.remoteAddress + "-" + response.payload.username
                  peers[peerId] = socket
                  socket.send(JSON.stringify({
                        event: "peerId",
                        payload: peerId
                  }))
            } else {
                  response.peers.forEach((peer) => {
                        if (peer.peerid != response.peer.peerid && peers[peer.peerid]) {
                              peers[peer.peerid].send(JSON.stringify({
                                    event: response.event,
                                    payload: response.payload,
                                    peer: response.peer
                              }))
                        }
                  })
            }
      })
})