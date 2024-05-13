<template>
	<view class="content">
		<view class="title">
			<view class="texts">
				<view>得分：{{score[0]}}</view>
				<view>等级：{{parseInt(score[0]/score[1])}}</view>
			</view>
			<view class="blockMinMap">
				<view v-for="(line, i) in blocks[nextBlock[0]][nextBlock[1]]" :key="'minimap-line-'+i" class="line">
					<view v-for="(b, j) in line" :key="'minimap-line-'+i+'-block-'+j" :class="{'block':b==1}"></view>
				</view>
			</view>

			<view class="watchPart">
				<button @click="watchButton">开关</button>
				<h1 v-if="buttonValue">我想静静地玩(〃∀〃)</h1>
				<h1 v-else>输入{{id}}看我操作(✪ω✪)</h1>
			</view>

		</view>

		<view class="gameView" :style="{height:gameViewHeight+'px'}">
			<view v-for="(line, i) in getTrueMap()" :key="'map-line-'+i" class="line">
				<view v-for="(b, j) in line" :key="'map-line-'+i+'-block-'+j" :class="{'block':b>0}"
					:style="{width:getGameViewBlockSize()+'px', height:getGameViewBlockSize()+'px'}"></view>
			</view>
		</view>


		<view class="buttonView" id="buttonView">
			<view @tap="moveLeft()" @longpress="longpress">←</view>
			<view @tap="moveDown()">↓</view>
			<view @tap="rotateBlock()">〇</view>
			<view @tap="moveRight()">→</view>
		</view>
	</view>
</template>

<script src='./first_page'></script>

<style>
	@import url('first_page.css');
</style>