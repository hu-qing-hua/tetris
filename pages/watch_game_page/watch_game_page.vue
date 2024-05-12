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
			<view class="ttui-cells">
				<view class="ttui-cell">
					<view class="ttui-cell__bd">允许观看</view>
					<view class="ttui-cell__ft">
						<!-- <switch bindchange="toggleSocket" checked="{{socketStatus == 'connected'}}" /> -->
					</view>
				</view>
		</view>
	</view>
	
	<view class="gameView" :style="{height:gameViewHeight+'px'}">
		<view v-for="(line, i) in trueMap" :key="'map-line-'+i" class="line">
			<view v-for="(b, j) in line" :key="'map-line-'+i+'-block-'+j" :class="{'block':b>0}"
				:style="{width:getGameViewBlockSize()+'px', height:getGameViewBlockSize()+'px'}"></view>
		</view>
	</view>
	
	
	<view class="buttonView" id="buttonView">
		<view >←</view>
		<view >↓</view>
		<view >〇</view>
		<view >→</view>
	</view>
	</view>
</template>

<script src='./watch_game_page'></script>

<style>
	@import url('watch_game_page.css');
</style>