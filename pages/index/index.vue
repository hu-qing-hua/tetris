<template>
	<!-- <img class="image-bg" src="@/static/bg.png"/> -->
	<view class="container">
		<view class="intro">This is a funny Tetris Game.</view>
		<uni-link :href="href" :text="hrefText"></uni-link>
		<navigator url="/pages/first_page/first_page">进入游戏界面</navigator>
		<navigator url="/pages/watch_game_page/watch_game_page">在线观看游戏</navigator>
		<button @click="playmusic">音乐</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				href: 'https://uniapp.dcloud.io/component/README?id=uniui',
				hrefText: "点击查看游戏指南",
			}
		},
		created() {
			// 创建音乐对象
			let audio = new Audio();
			// 设置音乐文件路径
			audio.src = '/static/audio/music.mp3';
			// 开始播放
			audio.play();
		}
	};
</script>

<style>
	.image-bg {
		position: absolute;
		z-index: -1;
		left: 0;
		right: 0;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}
</style>