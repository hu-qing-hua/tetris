import {
	validateId,
	init
} from '../../Connect.js'
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
			showModal: false, // 控制弹框显示
			inputId: '', // 存储用户输入的ID
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
		},

		handleClick() {
			// 点击按钮时，显示输入ID的弹框
			this.showModal = true;
			uni.showModal({
				title: '请输入ID',
				editable: true, // 允许输入
				placeholderText: '请输入ID',
				success: (res) => {
					if (res.confirm) {
						// 用户点击了确定
						const inputId = res.content;
						this.handleConfirm(inputId);
					}
				}
			});
		},
		handleConfirm(inputId) {
			// 用户点击确认按钮时的处理逻辑
			init(() => {
				validateId(inputId, (success) => {
					if (success) {
						console.log('ID validated successfully');
						uni.navigateTo({
							url: '/pages/watch_game_page/watch_game_page'
						});
					} else {
						// ID错误，给出提示
						uni.showToast({
							title: 'ID不正确，请重试',
							icon: 'none'
						});
					}
				})
			})
		},
	}
};