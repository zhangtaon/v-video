<template>
  <div class="player-wrap">
    <div class="player-label">播放器：</div>
    <!-- many times录播 -->
    <video-player
      v-if="module==1"
      :options="options"
      :play-back-url="getPlayBackUrl('a','b')"
      :control-title-bar-text="[ '沧州大化集团','101车间北乙醇罐 ']"
      @dispose="dispose"
    />
    <!-- onec录播 -->
    <video-player
      v-if="module==2"
      :poster="poster"
      :play-back-url="getPlayBackUrl('a','b','c','d')"
    />
    <!-- 直播 -->
    <video-player
      v-if="module==3"
      :live-url="getLiveUrl()"
      :play-back-url="getPlayBackUrl('a','b')"
      :control-title-bar-text="[ '沧州大化集团','101车间北乙醇罐']"
    />
  </div>
</template>
<script>
// defaultFullScreen
import { log } from "../lib/components/util";
import bbb from "./video/bbb.flv";
import play from "./video/play.flv";
import cz from "./video/cz.flv";
import error from "./video/error.flv";
import oceans from "./image/oceans.png";
import poster from "./image/poster.jpg";

import VideoPlayer from "../lib/VideoPlayer.vue";

export default {
  name: "App",
  components: {
    VideoPlayer
  },
  data() {
    return {
      // poster: "",
      poster: poster,
      options: {
        // poster: ""
        poster: oceans
      },
      module: 1
    };
  },
  methods: {
    getPlayBackUrl(a, b, c, d) {
      let fn = async function(c, d) {
        const sleep = timeountMS =>
          new Promise(resolve => {
            setTimeout(resolve, timeountMS);
          });
        await sleep(1000);
        let playBack = [
          // {
          //      // 官方数据：
          //     "fileName": bbb,
          //     "duration": 33000
          // }
          // {
          //     //  本地数据：洋洋
          //     "fileName": play,
          //     "duration": 40000
          // }
          {
            //沧州现场数据: 丢帧 && 时间错误 && 报错
            fileName: cz,
            duration: 150056745
          }
          // {
          //     //沧州现场数据：时间错误 && 报错 （ 摄像头模块 列表页摄像头名称为：101车间北乙醇罐 ）
          //     "fileName": error,
          //     "duration": 150056745
          // }
        ];
        if (Array.isArray(playBack)) {
          let op = {
            duration: 0,
            segments: []
          };
          playBack.forEach(function(item) {
            op.duration += Number(item.duration);
            op.segments.push({ url: item.fileName, duration: item.duration });
          });
          return op;
        }
      };
      if (c && d) {
        log("..........fn(c,d)");
        return fn(c, d);
      } else {
        log("..........fn");
        return fn;
      }
    },
    getLiveUrl() {
      return "http://ivi.bupt.edu.cn/hls/hunanhd.m3u8";
    },
    dispose() {
      log("app dispose");
    }
  }
};
</script>
<style lang="scss" scoped>
.player-wrap {
  margin: 0 auto;
  margin-top: 100px;
  width: 1000px;
  height: 563px;
}
.player-label {
  position: absolute;
  z-index: 2;
  left: 40%;
  top: 4%;
  width: 300px;
  height: 100px;
  background: red;
  text-align: center;
  line-height: 100px;
  color: mediumblue;
}
</style>