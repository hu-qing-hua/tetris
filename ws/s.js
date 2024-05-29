const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

const clients = {};
const idMap = {};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.event === 'generateId') {
      const generatedId = generateRandomId(3);
      idMap[generatedId] = { ws, peers: [] };
      ws.send(JSON.stringify({ event: 'idGenerated', id: generatedId }));
    }
    else if (data.event === 'validateId') {
      const targetInfo = idMap[data.id];
      if (targetInfo) {
        targetInfo.peers.push(ws);
        clients[ws] = data.id;
        ws.send(JSON.stringify({ event: 'idValidated', success: true }));
        targetInfo.ws.send(JSON.stringify({ event: 'peerConnected' }));
      } else {
        ws.send(JSON.stringify({ event: 'idValidated', success: false }));
      }
    }
    else {
          wss.clients.forEach(function each(client) {    
      if (client !== ws && client.readyState === WebSocket.OPEN) {  
        client.send(message);  
      }  
    });  
    }
  });

  ws.on('close', () => {
    const clientId = clients[ws];
    if (clientId) {
      const targetInfo = idMap[clientId];
      if (targetInfo) {
        // 删除该ws在peers中的引用
        targetInfo.peers = targetInfo.peers.filter(peer => peer !== ws);
        if (targetInfo.ws === ws) {
          // 如果关闭的是A，则通知所有B并清理所有B的连接
          targetInfo.peers.forEach(peer => {
            peer.send(JSON.stringify({ event: 'peerDisconnected' }));
            delete clients[peer];
          });
          delete idMap[clientId];
        }
      }
      delete clients[ws];
    }
  });
});

function generateRandomId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
}

