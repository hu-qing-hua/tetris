<template>
	<img class="image-bg" src="@/static/bg1.png" />
	<view class="container">
		<view class="intro">
			<img class="image-sucai" src="@/static/sucai.png" />
		</view>
		<view class="items">
			<navigator url="/pages/first_page/first_page">进入游戏界面 --></navigator>
		</view>
		<view class="items">
			<navigator url="/pages/watch_game_page/watch_game_page">在线观看游戏 --></navigator>
		</view>
		<button class="button" @click="toggleMusic">{{ playing ? '关闭音乐' : '播放音乐' }}</button>
		<view class="blank-line"></view>
		<uni-link :href="href" :text="hrefText"></uni-link>
	</view>
</template>

<script>
	let dataUrl = 'https://sf1-ttcdn-tos.pstatp.com/obj/developer/sdk/0000-0001.mp3';
	export default {
		data() {
			return {
				href: 'https://uniapp.dcloud.io/component/README?id=uniui',
				hrefText: "点击查看游戏指南",
				// 添加一个用于跟踪音乐状态的变量
				playing: false,
				pause: true,
				// 声明音乐实例
			}
		},
		onLoad() {
			if (this.innerAudioCtx) {
				return;
			}
			const innerAudioCtx = this.innerAudioCtx = tt.createInnerAudioContext();
			innerAudioCtx.src = dataUrl;
			innerAudioCtx.startTime = 0;
			innerAudioCtx.obeyMuteSwitch = false;
			innerAudioCtx.onError((err) => {
				console.log("onError: ", err);
			});
			innerAudioCtx.onCanplay(() => {
				console.log("onCanplay");
			});
		},
		onUnload() {
			if (this.innerAudioCtx) {
				this.innerAudioCtx.offCanplay();
				this.innerAudioCtx.destroy();
			}
		},
		methods: {
			toggleMusic() {
				// 切换音乐状态
				this.pause = !this.pause;
				this.playing = !this.playing;
				if (this.playing) {
					this.innerAudioCtx.play();
				} else {
					this.innerAudioCtx.pause();
				}
			}
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



	.intro {
		height: 400px;
		width: 100%;
		/* border-style: solid;
		border-color: #00CED1; */
		background-position: top center;
		background-size: repeat;
	}

	.image-sucai {
		width: 100%;
		height: 350px;
	}



	.items {
		height: 100px;
		width: 80%;
		/* border-style: solid;
			border-color: aquamarine; */
		text-align: center;
		vertical-align: middle;
		font-size: 22px;
		font-weight: 1000;
		color: #006400;
		text-shadow: 0 0 0.2em #BDB76B;
	}

	.blank-line {
		height: 30px;
	}

	.button {
		border-radius: 10px;
		background-color: aliceblue;
		box-shadow: 0px 0px 2px 2px rgb(127, 255, 212);
		min-height: 10px;
		min-width: 90px;
		color: #006400;
		font-weight: bold;
	}
</style>