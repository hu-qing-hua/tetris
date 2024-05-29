const WebSocket = require('ws'); 
  
const wss = new WebSocket.Server({ port: 3000 });  
  
wss.on('connection', function connection(ws) {  
  ws.on('message', function incoming(message) {  
    console.log('received: %s', message);  
  
    // 在这里处理接收到的消息，比如广播给所有连接  
    wss.clients.forEach(function each(client) {  
      if (client !== ws && client.readyState === WebSocket.OPEN) {  
        client.send(message);  
      }  
    });  
  });  
  
});







