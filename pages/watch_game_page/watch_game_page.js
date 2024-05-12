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
		this.refreshNextBlock()
		this.refreshNextBlock()
	},
	onLoad() {
		let that = this
		init(() => {
			subscribe('gameData')
			listenData((res) => {
				try {
					let tmp = JSON.parse(res).data.data//JSON.parse(res)是将收到的字符串解析为JSON对象 
					//JSON.parse(res).data.data是JSON.parse(res)的data字段的值
					that.trueMap = tmp.data
					console.log(tmp);

					that.nextBlock = tmp.nextBlock
					console.log('-------------', tmp.score);
					if (tmp.score.length) that.score = tmp.score

					console.log(that.score);
				} catch (e) {
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
		refreshNextBlock() {
			this.nowBlock = this.nextBlock
			var nextBlock = [
				parseInt(Math.random() * this.blocks.length),
				0
			]
			nextBlock[1] = parseInt(this.blocks[nextBlock[0]].length * Math.random())
			this.nextBlock = nextBlock
			this.blockPosition = JSON.parse(JSON.stringify(this.startPosition));
			// console.log(this.blockPosition)
			this.$forceUpdate()
		},

	}
}