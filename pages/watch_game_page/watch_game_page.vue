<template>
	<view>
		<text v-for="(data, index) in gameDataList" :key="index">{{ data }}</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gameDataList: [] // 用于存储接收到的游戏数据
			};
		},
		onLoad() {
			// 创建 WebSocket 连接
			const socket =  io('ws://localhost:3000');

			// 监听服务器发送的游戏数据
			socket.on('gameData', (data) => {
				console.log('Received game data:', data);
				// 将游戏数据添加到游戏数据列表中
				this.gameDataList.push(data);
			});
		}
	};
</script>