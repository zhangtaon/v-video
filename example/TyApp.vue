<template>
  <div>
    <div v-if="module==1" class="player-wrap">
      <p>直播：</p>
      <ty-player
        class="player-wrap"
        :playing="livePlay && livePlay.onLine"
        :nvrAddr="livePlay.nvrAddr"
        :channelAddr="livePlay.channelAddr"
        :control-title-bar-text="[livePlay.orgName, livePlay.videoName]"
        live
        playBack
      />
    </div>
    <div v-if="module==2" class="player-wrap">
      <p>录播（默认全屏，选择时间观看）：</p>
      <ty-player
        :nvrAddr="playBack.nvrAddr"
        :channelAddr="playBack.channelAddr"
        playBack
        defaultFullScreen
        @dispose="dispose"
        class="player-wrap"
      />
    </div>
    <div v-if="module==3" class="player-wrap">
      <p>录播 （默认小屏加载固定录播源）：</p>
      <ty-player
        :nvrAddr="playBack.nvrAddr"
        :channelAddr="playBack.channelAddr"
        :start="playBack.startTime"
        :end="playBack.endTime"
        :poster="playBack.poster"
        playBack
        class="player-wrap"
        :playBackUrl="playBack.playBackUrl"
      />
    </div>
  </div>
</template>
<script>
import TyPlayer from "../lib/TyPlayer.vue";
import poster from "./image/poster.jpg";
import { log } from "../lib/components/util";

export default {
  name: "App",
  data() {
    return {
      module: 1,
      playBackUrl: "/video/queryAlarmRecorderList",
      nvrAddr: "13098300001181005039",
      channelAddr: "hunanhd.m3u8",
      livePlay: {},
      playBack: {}
    };
  },
  components: {
    TyPlayer
  },
  created() {
    // 直播验证：播放中断（ 互益化工 厂区监控 ）
    this.livePlay = {
      onLine: true,
      nvrAddr: "13098300001181005013",
      channelAddr: "13098300001311013003",
      orgName: "互益化工",
      videoName: "厂区监控"
    };
    // // 直播验证
    // this.livePlay = {
    //   onLine: true,
    //   nvrAddr: "13098300001181005001",
    //   channelAddr: "13098300001311001010",
    //   orgName: "河北天成药业",
    //   videoName: "101车间北乙醇罐"
    // };
    // this.playBack = {
    //   // playBackUrl: "/video/queryAlarmRecorderList",
    //   poster,
    //   nvrAddr: "13098300001181005051",
    //   channelAddr: "13098300001311051001",
    //   startTime: "1584100920000",
    //   endTime:   "1584101120000"
    //   // startTime: "1584100320000",
    //   // endTime:   "1584100920000"
    // };

    // 沧州现场录播不自动播放验证 （摄像头模块）
    this.playBack = {
      playBackUrl: "/video/queryAlarmRecorderList",
      poster,
      nvrAddr: "13098300001181005051",
      channelAddr: "13098300001311051003",
      startTime: "1584169500000",
      endTime:   "1584169500000"
    };
  },
  methods: {
    dispose() {
      log(".......ty app dispose");
    }
  }
};
</script>
<style lang="scss" scoped>
.player-wrap {
  margin: 0 auto;
  margin-top: 30px;
  width: 1000px;
  height: 563px;
  font-size: 26px;
}
</style>