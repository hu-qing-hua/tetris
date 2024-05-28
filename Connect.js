const connectUrl = `ws://192.168.50.71:3000`;

let socketTask;

export const init = (call) => {
  socketTask = uni.connectSocket({
    url: connectUrl,
    success() {
      console.log('WebSocket 连接成功');
      socketTask.onOpen(() => {
        call();
        console.log("WebSocket 已连接");
      });
    },
    fail(err) {
      console.log('WebSocket 连接失败', err);
    }
  });

  socketTask.onClose(() => {
    console.log("WebSocket 已断开");
  });
  socketTask.onError((error) => {
    console.error("WebSocket 发生错误:", error);
  });
};

export const generateId = (callback) => {
  socketTask.send({
    data: JSON.stringify({ event: 'generateId' }),
    success: () => {
      console.log('ID generation request sent');
    },
    fail: (err) => {
      console.error('Failed to send ID generation request', err);
    }
  });

  socketTask.onMessage((res) => {
    const data = JSON.parse(res.data);
    if (data.event === 'idGenerated') {
      callback(data.id);
    }
  });
};

export const validateId = (id, callback) => {
  socketTask.send({
    data: JSON.stringify({ event: 'validateId', id: id }),
    success: () => {
      console.log('ID validation request sent');
    },
    fail: (err) => {
      console.error('Failed to send ID validation request', err);
    }
  });

  socketTask.onMessage((res) => {
    const data = JSON.parse(res.data);
    if (data.event === 'idValidated') {
      callback(data.success);
    }
  });
};

export const subscribe = (topic) => {
  socketTask.send({
    data: JSON.stringify({
      event: 'subscribe',
      data: topic
    }),
    success: (res) => {
      console.log('Subscribed to topic:', topic);
    },
    fail: (err) => {
      console.error('Failed to subscribe:', err);
    }
  });
};

export const publishMessage = (topic, data) => {
  socketTask.send({
    data: JSON.stringify({
      event: 'publish',
      data: {
        topic,
        data // 要发布的消息内容
      }
    }),
    success: () => {
      console.log('Message published:', topic);
    },
    fail: (err) => {
      console.error('Failed to publish message:', err);
    }
  });
};

function arrayBufferToString(buffer) {
  const uint8Array = new Uint8Array(buffer);
  let str = '';
  for (let i = 0; i < uint8Array.length; i++) {
    str += String.fromCharCode(uint8Array[i]);
  }
  return str;
}

export const listenData = ( call) => {// call作为一个回调函数当参数传入
	socketTask.onMessage((res) => {//onMessage属性，收到server数据后的回调函数
		console.log(arrayBufferToString(res.data));
		call(arrayBufferToString(res.data));
	})
}