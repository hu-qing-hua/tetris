const express = require('express');  
const http = require('http');  
const socketIo = require('socket.io');  
  
const app = express();  
const server = http.createServer(app);  
const io = socketIo(server);  
  
io.on('connection', (socket) => {  
  console.log('连接-------');
  
  // 使用 Redis 或其他方法实现频道的订阅和发布  
  // 这里简化处理，仅使用内存中的 Map  
  const topics = new Map();  
  
  socket.on('subscribe', (topic) => {  
    if (!topics.has(topic)) {  
      topics.set(topic, new Set());  
    }  
    topics.get(topic).add(socket.id);  
    console.log(`User subscribed to topic: ${topic}`);  
  });  
  
  socket.on('publish', (topic, message) => {  
    if (topics.has(topic)) {  
      const socketIds = topics.get(topic);  
      for (const socketId of socketIds) {  
        io.to(socketId).emit('message', { topic, message });  
      }  
    }  
    console.log(`Message published to topic: ${topic}`, message);  
  });  
  
  socket.on('disconnect', () => {  
    for (const [topic, socketIds] of topics) {  
      socketIds.delete(socket.id);  
      if (socketIds.size === 0) {  
        topics.delete(topic);  
      }  
    }  
    console.log('User disconnected');  
  });  
});  
  
server.listen(3000, () => {  
  console.log('Server listening on port 3000');  
});