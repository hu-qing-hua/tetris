import {
	init,
	subscribe,
	listenData
} from "../../Connect.js"
export default {
	data() {
		return {
			trueMap: [],
			//地图大小
			mapSize: [18, 10],
			//下降时间:开始，结束，每升一级减少等待时间
			downSpeed: [1000, 200, 100],
			//分数：现在分数，多少分升一级, step
			score: [0, 10, 1],
			//地图
			map: [],
			//7种方块，及其朝向
			blocks: [
				[
					[
						[0, 1, 1],
						[1, 1, 0]
					],
					[
						[1, 0],
						[1, 1],
						[0, 1]
					]
				],
				[
					[
						[1, 1, 0],
						[0, 1, 1]
					],
					[
						[0, 1],
						[1, 1],
						[1, 0]
					]
				],
				[
					[
						[1, 1, 1, 1]
					],
					[
						[1],
						[1],
						[1],
						[1]
					]
				],
				[
					[
						[1, 1],
						[1, 1]
					]
				],
				[
					[
						[0, 1, 0],
						[1, 1, 1]
					],
					[
						[0, 1],
						[1, 1],
						[0, 1]
					],
					[
						[1, 1, 1],
						[0, 1, 0]
					],
					[
						[1, 0],
						[1, 1],
						[1, 0]
					]
				],
				[
					[
						[0, 0, 1],
						[1, 1, 1]
					],
					[
						[1, 1],
						[0, 1],
						[0, 1]
					],
					[
						[1, 1, 1],
						[1, 0, 0]
					],
					[
						[1, 0],
						[1, 0],
						[1, 1]
					]
				],
				[
					[
						[1, 0, 0],
						[1, 1, 1]
					],
					[
						[0, 1],
						[0, 1],
						[1, 1]
					],
					[
						[1, 1, 1],
						[0, 0, 1]
					],
					[
						[1, 1],
						[1, 0],
						[1, 0]
					]
				],
			],
			//方块开始位置
			startPosition: [0, 4],
			//方块现在位置
			blockPosition: [0, 0],
			//当前方块限制：方块种类，方块朝向
			nowBlock: [0, 0],
			//下一个方块限制: 方块种类，方块朝向
			nextBlock: [0, 0],
			//游戏窗口高度:
			gameViewHeight: 450,
			//游戏结束
			gameOver: false,

			//游戏循环体
			gameUpdateFunc: null,

			audio: null,
		}
	},
	mounted() {
		// this.refreshNextBlock()
		// this.refreshNextBlock()
	},
	onLoad() {
		let that = this //this可能改变，用that保存对当前对象的引用
		init(() => {
			subscribe('gameData')
			listenData((res) => {
				try {
					let tmp = JSON.parse(res).data.data //JSON.parse(res)是将收到的字符串解析为JSON对象 
					//JSON.parse(res).data.data是JSON.parse(res)的data字段的值,因为res除了返回定义好的数据，还会返回像网络状态、是否成功等信息
					that.trueMap = tmp.map;
					console.log(tmp);

					that.gameOver = tmp.gameOver;
					if (that.gameOver) {
						uni.showModal({
							showCancel: false,
							confirmText: '再看一局',
							title: '游戏结束',
							content: '好友分数:' + this.score[0],
							success: (res) => {
								if (res.confirm) {
									that.initGame()
								}
							}
						})
					}
					that.nextBlock = tmp.nextBlock;
					console.log('-------------', tmp.score);
					if (tmp.score.length) that.score = tmp.score;

					console.log(that.score);
				} catch (e) { //catch()块用于捕获try块中可能抛出的异常
					// console.log('错误',e);
					//TODO handle the exception
				}

			})
		})
	},
	methods: {

		tryGetGameHeight() {
			var that = this;
			this.$nextTick(function() {
				that.gameViewHeight = uni.getSystemInfoSync().windowHeight - 170;
			})
		},
		getGameViewBlockSize() {
			var padding = 40
			return Math.min(
				parseInt((this.gameViewHeight - padding) / this.mapSize[0]),
				parseInt((uni.getSystemInfoSync().windowWidth - padding) / this.mapSize[1])
			)
		},
	},
}