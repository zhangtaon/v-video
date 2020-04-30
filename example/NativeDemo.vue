<template>
  <div class="videoDemo">
    <!-- <div class="item">
      <h1>原生video标签</h1>
      <video width="600" height="300" muted autoplay controls preload="none">
        <source src="http://localhost:8083/video/video/oceans.mp4" type="video/mp4">
      </video>
    </div> -->

    <div class="item">
      <h2>flvjs</h2>
      <video
        ref="flvdemo"
        width="600"
        height="300"
        controls
        preload="none"
      ></video>
    </div>

    <div class="item">
      <h2>videojs</h2>
      <video
        ref="videodemo"
        class="video-js vjs-big-play-centered"
        crossorigin="anonymous"
      />
    </div>
  </div>
</template>
<script>
import "video.js/dist/video-js.css";
import "expose-loader?videojs!video.js/dist/video.js";
import "expose-loader?flvjs!flv.js/dist/flv";
import "videojs-flvjs/dist/videojs-flvjs";
import videoConstant from "../lib/videoConstant";
import { log } from "../lib/components/util";
import cz from "./video/cz.flv";
import error from "./video/error.flv";
import bbb from "./video/bbb.flv";
import play from "./video/play.flv";

export default {
  name: "FlvDemo",
  mounted() {
    // this.initFlvJsLive(true);
    this.initFlvJs(true);
    // this.initVideoJsForFlv(true);
    // this.initVideoJsForMP4();
    // this.initVideoJsForFlvToLive();
    // this.initVideoJsForLiveToFlv();
  },
  methods: {
    // flvjs录播切直播  成功
    initFlvJs(type) {
      let player = flvjs.createPlayer({
        type: "flv",
        // duration: 73000,
        // segments: [
        //   {
        //     filesize: 60369190,
        //     duration: 33000,
        //     url: "http://localhost:8083/video/video/bbb.flv"
        //   },
        //   {
        //     filesize: 75726439,
        //     duration: 40000,
        //     url: "http://localhost:8083/video/video/play.flv"
        //   }
        // ],
        // url: "http://localhost:8088/video/video/bbb.flv",
        url: error,
        isLive: false
      });
      player.attachMediaElement(this.$refs.flvdemo);
      player.load(); //加载
      player.play();
      if (type) {
        return;
      }
      setTimeout(() => {
        player.destroy();
        player = null;
        this.initFlvJsLive();
      }, 40000);
    },
    // flvjs直播切直播  成功
    initFlvJsLive(type) {
      let player = flvjs.createPlayer({
        type: "flv",
        // url: "https://dlhdl-cdn.zhanqi.tv/zqlive/35349_iXsXw.flv",
        url: "https://dlhdl-cdn.zhanqi.tv/zqlive/290003_QVDZJ.flv",
        isLive: true
      });
      player.attachMediaElement(this.$refs.flvdemo);
      player.load(); //加载
      player.play();
      if (type) {
        return;
      }
      setTimeout(() => {
        player.destroy();
        player = null;
        this.initFlvJsLive2();
      }, 10000);
    },
    //flvjs 直播切录播  成功
    initFlvJsLive2(type) {
      let player = flvjs.createPlayer({
        type: "flv",
        url: "https://dlhdl-cdn.zhanqi.tv/zqlive/197952_NHycj.flv",
        isLive: true
      });
      player.attachMediaElement(this.$refs.flvdemo);
      player.load(); //加载
      player.play();
      if (type) {
        return;
      }
      setTimeout(() => {
        player.destroy();
        player = null;
        this.initFlvJs();
      }, 10000);
    },
    // videojs录播mp4切mp4  成功
    initVideoJsForMP4() {
      let option = {
        techOrder: ["html5"],
        autoplay: "muted",
        controls: true,
        controlBar: {
          progressControl: true
        },
        sources: [
          {
            src: "http://localhost:8083/video/video/p4.mp4",
            type: videoConstant.mp4
          }
        ]
      };
      let player = videojs(
        this.$refs.videodemo,
        option,
        function onPlayerReady() {
          log("***onPlayerReady***");
          this.on("ended", function() {
            player.src({
              src: "http://localhost:8083/video/video/oceans.mp4",
              type: videoConstant.mp4
            });

            player.ready(function() {
              player.load();
              player.play();
            });
            this.off("ended");
          });
        }
      );
      log("player:", player);
    },
    // videojs录播flv切flv 失败
    initVideoJsForFlv(type) {
      let option = {
        techOrder: ["flvjs"],
        flvjs: {
          mediaDataSource: {
            isLive: false,
            cors: true,
            withCredentials: false
          }
        },
        autoplay: "muted",
        controls: true,
        sources: [
          {
            src: cz,
            type: videoConstant.flv
          }
        ]
      };
      let player = videojs(
        this.$refs.videodemo,
        option,
        function onPlayerReady() {
          log("***onPlayerReady***");
          if (type) {
            return;
          }
          this.on("ended", function() {
            player.src({
              src: "http://localhost:8083/video/video/play.flv",
              type: videoConstant.flv
            });
            player.ready(function() {
              player.load();
              player.play();
            });
            this.off("ended");
          });
        }
      );
    },
    // videojs flv多段切直播
    initVideoJsForFlvToLive(type) {
      let option = {
        techOrder: ["html5", "flvjs"],
        flvjs: {
          mediaDataSource: {
            isLive: false,
            cors: true,
            withCredentials: false,
            duration: 73000,
            segments: [
              {
                filesize: 60369190,
                duration: 33000,
                url: "http://localhost:8083/video/video/bbb.flv"
              },
              {
                filesize: 75726439,
                duration: 40000,
                url: "http://localhost:8083/video/video/play.flv"
              }
            ]
          }
        },
        autoplay: "muted",
        controls: true,
        sources: [{ src: "-1", type: videoConstant.flv }]
      };
      let player = videojs(
        this.$refs.videodemo,
        option,
        function onPlayerReady() {
          log("***onPlayerReady***");
          if (type) {
            return;
          }
          this.on("ended", function() {
            log("player:", player);
            player.src({
              src: "http://ivi.bupt.edu.cn/hls/hunanhd.m3u8",
              type: videoConstant.hls
            });
            player.ready(function() {
              player.load();
              player.play();
            });
            this.off("ended");
          });
        }
      );
    },
    // videojs 直播切flv多段
    initVideoJsForLiveToFlv(type) {
      let option = {
        techOrder: ["html5", "flvjs"],
        flvjs: {
          mediaDataSource: {
            isLive: false,
            cors: true,
            withCredentials: false
          }
        },
        autoplay: "muted",
        controls: true,
        sources: [
          {
            src: "http://ivi.bupt.edu.cn/hls/hunanhd.m3u8",
            type: videoConstant.hls
          }
        ]
      };
      let player = videojs(
        this.$refs.videodemo,
        option,
        function onPlayerReady() {
          log("***onPlayerReady***");
          if (type) {
            return;
          }
          this.on("ended", function() {
            log("player:", player);
            player.src({
              src: "http://ivi.bupt.edu.cn/hls/hunanhd.m3u8",
              type: videoConstant.hls
            });
            player.ready(function() {
              player.load();
              player.play();
            });
            this.off("ended");
          });
          setTimeout(() => {
            player.options_.flvjs.mediaDataSource.duration = 73000;
            player.options_.flvjs.mediaDataSource.segments = [
              {
                duration: 33000,
                url: "http://localhost:8083/video/video/bbb.flv"
              },
              {
                duration: 40000,
                url: "http://localhost:8083/video/video/play.flv"
              }
            ];
            player.src({ src: "-1", type: videoConstant.flv });
            player.ready(function() {
              player.load();
              player.play();
            });
          }, 16000);
        }
      );
    }
  }
};
/*
videojs api --
  updateSourceCaches_
  resetCache_
  getCache
  selectSource
  reset
  currentSources
  currentSource
  currentSrc
  currentType
  loadMedia
  getMedia
  reloadSourceOnError 
  */
/*
videojs hls m3u8直播源切换  成功
videojs flv 直播源切换      失败
videojs mp4 录播源切换      成功
videojs mp4切flv 录播源切换 成功
videojs flv切mp4 录播源切换 成功
videojs flv 录播源切换      失败
flvjs   flv 合并视频源      成功
flvjs   flv 直播           失败
*/
</script>
<style lang="scss" scoped>
.item {
  float: left;
  font-size: 20px;
}
</style>
