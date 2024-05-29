const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

const clients = {};
const idMap = {};

// 存储客户端的订阅信息
const subscriptions = new Map();

wss.on('connection', (ws) => {

// 每个客户端连接时初始化它的订阅列表
  ws.topics = new Set();

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
        const parsedMessage = JSON.parse(message);
    const { event, topic, data } = parsedMessage;

    switch (event) {
      case 'subscribe':
        // 客户端请求订阅某个主题
        ws.topics.add(topic);
        if (!subscriptions.has(topic)) {
          subscriptions.set(topic, new Set());
        }
        subscriptions.get(topic).add(ws);
        break;

      case 'unsubscribe':
        // 客户端请求取消订阅某个主题
        ws.topics.delete(topic);
        if (subscriptions.has(topic)) {
          subscriptions.get(topic).delete(ws);
          if (subscriptions.get(topic).size === 0) {
            subscriptions.delete(topic);
          }
        }
        break;

      case 'publish':
        // 客户端发送消息到某个主题
        if (subscriptions.has(topic)) {
          subscriptions.get(topic).forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
               client.send(message);  
            }
          });
        }
        break;

      default:
        console.log('Unknown message type:', event);
    }
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

