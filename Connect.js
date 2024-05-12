const connectUrl = `ws://192.168.50.71:3000`

let socketTask

export const init = (call) => {//函数的块体语法，传参call这个回调函数

	socketTask = uni.connectSocket({//uni-app里创建websocket实例的方法
		url: connectUrl, 
		success() {//连接成功，接口调用success的回调函数
			console.log('WebSocket 连接成功');
			socketTask.onOpen(() => {//websocket实例具有的属性onOpen,用于连接成功时的回调函数
				call()
				console.log("WebSocket 已连接");
			});
		},

		fail(err) {//连接失败，接口调用fail的回调函数
			console.log('WebSocket 连接失败', err);
		}
	});

	socketTask.onClose(() => {
		console.log("WebSocket 已断开");
	});
	socketTask.onError((error) => {
		console.error("WebSocket 发生错误:", error);
	});
	// socketTask.onMessage((message) => {
	// 	console.log("socket message:", message);
	// });

}

export const subscribe = (topic) => {
	console.log('发送消息');
	socketTask.send({
		data: JSON.stringify({
			event: 'subscribe', // 模拟 Socket.IO 的事件名  
			data: topic, // 发送频道名进行订阅  
		}),
		success: (res) => {
			console.log('Subscribed to topic:', topic);
		},
		fail: (err) => {
			console.error('Failed to subscribe:', err);
		},
	});
}

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
			console.log('Message published:',topic);
		},
		fail: (err) => {
			console.error('Failed to publish message:', err);
		},
	});
}

//ArrayBuffer 对象用来表示通用的原始二进制数据缓冲区
//Unit8Array是8位无符号整数组成的数组，可以按字节访问
// function arrayBufferToString(buffer) {
//   const uint8Array = new Uint8Array(buffer);//将传入的 ArrayBuffer 转换为一个 Uint8Array 类型的数组。
//   const decoder = new TextDecoder();//创建TextDecoder对象，它可以将字节序列解码为字符串
//   return decoder.decode(uint8Array);//返回将 Uint8Array 数组解码后的字符串
// }

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
		call(arrayBufferToString(res.data))
	})
}