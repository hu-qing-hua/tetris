const connectUrl = `ws://192.168.50.71:3000`;

let socketTask;

export const initWebSocket = (callback) => {
	socketTask = uni.connectSocket({
		url: connectUrl,
		success() {
			console.log('WebSocket 连接成功');
			socketTask.onOpen(() => {
				callback();
				console.log('WebSocket 已连接');
			});
		},
		fail(err) {
			console.log('WebSocket 连接失败', err);
		}
	});

	socketTask.onClose(() => {
		console.log('WebSocket 已断开');
	});

	socketTask.onError((error) => {
		console.error('WebSocket 发生错误:', error);
	});
};

export const sendMessage = (data, successCallback, errorCallback) => {
	socketTask.send({
		data: JSON.stringify(data),
		success: successCallback,
		fail: errorCallback
	});
};

export const listenMessage = (callback) => {
	socketTask.onMessage((res) => {
		const data = JSON.parse(res.data);
		callback(data);
	});
};

export const generateId = () => {
	socketTask.send({
		data: JSON.stringify({
			event: 'generated_id',
		}),
		success: () => {
			console.log('ID generation request sent');
		},
		fail: (err) => {
			console.error('Failed to send ID generation request:', err);
		}
	});
};

export const validateId = (id) => {
	socketTask.send({
		data: JSON.stringify({
			event: 'validate_id',
			data: {
				id
			},
		}),
		success: () => {
			console.log('ID validation request sent:', id);
		},
		fail: (err) => {
			console.error('Failed to send ID validation request:', err);
		}
	});
};


export const publishMessage = (topic, data) => {
	let tmp = JSON.stringify({
		event: 'publish', // 模拟 Socket.IO 的事件名  
		data: {
			topic,
			data // 要发布的消息内容  
		}
	})
	// console.log('发送数据', tmp);
	socketTask.send({
		data: tmp,
		success: () => {
			console.log('Message published:', topic);
		},
		fail: (err) => {
			console.error('Failed to publish message:', err);
		},
	});
}