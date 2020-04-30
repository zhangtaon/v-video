<template>
  <video :id="id" ref="videoPlayer" class="video-js vjs-big-play-centered" crossorigin="anonymous" />
</template>
<script>
import "video.js/dist/video-js.css";
import "expose-loader?videojs!video.js/dist/video.js";
import "video.js/dist/lang/zh-CN";
import "expose-loader?flvjs!flv.js/dist/flv";
import "videojs-flvjs/dist/videojs-flvjs";
import $ from "jquery";
import videoConstant from "./videoConstant";
import { changeSource, stopSource } from "./components/playbackService";
import { log } from "./components/util";
import "./components";
import moment from "moment";

export default {
  name: "VideoPlayer",
  components: {},
  props: {
    // 播放器配置
    options: {
      type: Object,
      default() {
        return {};
      }
    },
    //立即播放控制
    playing: {
      type: Boolean,
      default: true
    },
    // 播放前封面
    poster: String,
    // 默认全屏
    defaultFullScreen: Boolean,
    //定制化titlebar要显示的文本（有则触发组件加载并渲染）
    titleBarText: String,
    controlTitleBarText: Array,
    id: {
      type: String,
      default: "player"
    },
    // 直播地址
    liveUrl: [String, Function, Promise],
    // 录播地址
    playBackUrl: [Function, Promise],
    //是否挂载全屏按钮组件，默认是
    fullScreen: {
      type: Boolean,
      default: true
    },
    //退出全屏事件回调
    exitFullScreenFn: {
      type: Function,
      default: function() {}
    }
  },
  async mounted() {
    if (this.liveUrl) {
      this._defaultFullScreen = this.defaultFullScreen;
      this.initLive();
    } else if (this.playBackUrl) {
      //默认录播
      //once录播情况
      if (this.playBackUrl instanceof Promise) {
        let plackbackData = await this.playBackUrl;
        let options = {
          flvjs: {
            mediaDataSource: {
              ...plackbackData
            }
          },
          sources: [
            {
              src: "-1",
              type: videoConstant.flv
            }
          ],
          poster: this.poster // 会被this.options.poster覆盖
        };
        this.initVideo(options);
      } else {
        // 可选择 （many times） 的录播情况
        this._defaultFullScreen = true;
        this.initVideo({
          autoplay: "muted"
        });
      }
    }
  },
  methods: {
    async initLive() {
      if (this.playing) {
        let _libeUrl = await this.liveUrl;
        log("_libeUrl*********************************************:", _libeUrl);
        if (!_libeUrl) {
          console.warn("播放源无效");
          return;
        }
        //默认直播
        this.initVideo({
          autoplay: "muted",
          sources: [
            {
              src: _libeUrl,
              type: videoConstant.hls
            }
          ]
        });
      }
    },
    initVideo(op) {
      let _options = {
        techOrder: ["html5", "flvjs"],
        flvjs: {
          mediaDataSource: {
            isLive: false,
            cors: true,
            withCredentials: false
          }
        },
        // preload: "auto",
        preload: "none",
        controls: true,
        controlBar: {
          volumePanel: false,
          remainingTimeDisplay: false,
          progressControl: false,
          fullscreenToggle: false,
          audioTrackButton: false,
          playToggle: false,
          liveDisplay: false,
          pictureInPictureToggle: false
        }
      };
      let _this = this;
      // 初始化播放器
      this.player = videojs(
        this.$refs.videoPlayer,
        videojs.mergeOptions(_options, op, this.options),
        function onPlayerReady() {
          //可选择的录播情况 更改默认启动按钮状态
          if (
            (!_this.liveUrl &&
              Object.prototype.toString.call(_this.playBackUrl) ==
                "[object AsyncFunction]") ||
            Object.prototype.toString.call(_this.playBackUrl) ==
              "[object Function]"
          ) {
            log(
              "可选择的录播情况 更改默认启动按钮状态******************************"
            );
            this.addClass("vjs-has-started");
            // this.getChild("ControlBar")
            //   .getChild("PlayToggle")
            //   .handlePause();
          }
        },
      );
      // log("this.player.controlBar:",this.player.controlBar);
      this.player.on("error",(e)=>{
        if(e.target){
          console.warn("播放器异常：",e.target.outerText);
        }else{
          console.warn("播放器异常：",e);
        }
        if(this.reconnectCount>=this.reconnectMaxCount)return;

        console.warn("开起播放源重新连接");
        let liveSource = this.player.src();
        changeSource(this.player);

        //重连策略
        if(this.reconnectTime && moment().diff(this.reconnectTime,'seconds')<5){
          this.reconnectCount++;
        }
        this.reconnectTime = moment();
      })
      
      this.player.on("play", () => {});
      this.player.on("pause", () => {});

      //是否初始化titlebar
      if (this.titleBarText) {
        this.player.addChild("TitleBar", { text: this.titleBarText });
      }

      this.player.on("fullscreen", () => {
        setTimeout(() => {
          let tyPlayBack = this.player.controlBar.getChild("TyPlayBack");
          if (tyPlayBack) {
            let $pb = $(tyPlayBack.el_);
            if (!this.liveUrl) {
              $pb.popover("show");
            }
          }
        }, 0);
        log("on fullscreen trigger");
      });

      this.player.on("exitFullscreen", () => {
        this.exitFullScreenFn();
      });
      this.player.on("playback", async (component, data) => {
        if (this.playBackUrl) {
          let plackbackData = await this.playBackUrl(
            data.startTime,
            data.endTime
          );
          data.callback(plackbackData);
        } else {
          log("回放参数playBackUrl 无效");
        }
      });
      if (this.fullScreen) {
        let customeBar = {};
        // 全屏遮罩
        this.player.addChild("TyMask");
        // 是否初始化控制栏title
        if (this.controlTitleBarText) {
          customeBar.TyControlTitleBar = {
            text: this.controlTitleBarText
          };
        }
        // 是否初始化回放面板
        if (this.playBackUrl) {
          if (
            Object.prototype.toString.call(_this.playBackUrl) ==
              "[object AsyncFunction]" ||
            Object.prototype.toString.call(this.playBackUrl) ==
              "[object Function]"
          ) {
            customeBar.TyPlayBack = "";
          }
        }
        let fullBtn = this.player.controlBar.addChild("TyFullScreenToggle", {
          disabledExitFullScreen: this._defaultFullScreen, //凡是默认全屏的情况都会禁用退出全屏按钮
          customeBar
        });
        //暴露切换全屏事件
        fullBtn.on("toggleFullScreen", function(e) {
          e.target.click();
        });
        if (this._defaultFullScreen) {
          // 只有默认全屏的场景才会有关闭按钮
          this.player.addChild("TyMaskClose");
          this.player.on("dispose", () => {
            this.$emit("dispose");
          });
          fullBtn.trigger("toggleFullScreen");
        }
      }
    }
  },
  watch: {
    controlTitleBarText(newVal) {
      if (this.player) {
        let controlTitleBar = this.player.controlBar.getChild("TyControlTitleBar");
        if(controlTitleBar){
          controlTitleBar.trigger("text",newVal);
        }
      }
    },
    async liveUrl(newVal) {
      if (this.playing) {
        if (this.player) {
          log("liveUrl changeSource...");
          changeSource(this.player, await newVal);
        } else {
          log("liveUrl initLive...");
          this.initLive();
        }
      }
    },
    playing(newVal) {
      if (!newVal) {
        if (this.player) {
          log("playing stop...");
          stopSource(this.player);
        }
      }
    }
  },
  data() {
    return {
      reconnectCount:0,
      reconnectMaxCount:10,
      player: null,
      _defaultFullScreen: false, //默认全屏（定制化全屏功能）展示
      _disabledExitFullScreen: false //禁用退出全屏按钮 ....
    };
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
};
</script>
<style lang="scss">
.scroll {
  overflow: hidden;
}
:focus{
      outline: 0;
}
.video-js {
  width: 100%;
  height: 100%;

  // 标题组件
  .vjs-title-bar {
    position: absolute;
    width: 100%;
    text-align: left;
    background: rgba(36, 57, 82, 0.5);
    font-size: 12px;
    color: #ffffff;
    line-height: 20px;
  }
  // 标题组件
  .vjs-control-title-bar {
    padding-left: 15px;
    padding-right: 15px;
    display: inline;
    font-size: 12px;
    color: #ffffff;
    line-height: 30px;
  }
  // 全屏模式设置
  &.video-full-screen {
    width: 80% !important;
    height: 80% !important;
    position: fixed;
    left: 0;
    right: 0;
    top: 10%;
    bottom: 0;
    margin: 0 auto;
    z-index: 10000;
    object-fit: contain;

    .vjs-tech {
      z-index: 9999;
    }

    .vjs-control-bar {
      z-index: 9999;
    }
    //全屏遮罩
    .vjs-mask {
      width: 100%;
      height: 100%;
      position: fixed;
      left: 0;
      top: 0;
      background: #000;
      opacity: 0.5;
      z-index: 9998;
    }
    .vjs-mask-close {
      font-family: cursive;
      position: relative;
      float: right;
      width: 48px;
      height: 48px;
      line-height: 49px;
      margin-right: -23px;
      margin-top: -24px;
      transform: rotate(45deg);
      font-size: 30px;
      text-align: center;
      background: #233c45;
      border-radius: 50%;
      cursor: pointer;
      z-index: 9999;
    }
  }
  // 全屏组件按钮
  .vjs-full-screen-btn {
    background: none;
    border: none;
    color: inherit;
    display: inline-block;
    font-size: inherit;
    line-height: inherit;
    text-transform: none;
    text-decoration: none;
    transition: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    &:before {
      font-size: 1.8em;
      line-height: 1.67;
      width: 100%;
      height: 100%;
    }
  }
  .vjs-date-time {
    &:before {
      display: inline-block;
      content: "";
      background: url(./image/video-date-icon.png) no-repeat;
      background-size: contain;
      width: 14px;
      height: 14px;
      margin-top: 8px;
      cursor: pointer;
    }
    &.playback {
      &:before {
        content: "\e074";
        background: #fff;
      }
    }
  }
  .popover {
    background: rgba(36, 57, 82, 0.8);
    border: 1px solid #1b7284;
    max-width: 350px;
    .popover-content {
      padding: 0 10px;
    }
    .container {
      width: 100%;
    }
    .form-horizontal {
      width: 270px;
    }
    .back {
      margin: 20px -15px;
      padding-left: 5px;
    }
    .control-label {
      font-size: 12px;
    }
    &.top > .arrow {
      border-top-color: #999;
      &:after {
        border-top-color: rgba(29, 38, 97, 1);
      }
    }
    .media,
    .media-body {
      overflow: visible;
    }
    .media-body {
      text-align: center;
      position: relative;
      left: 10px;
      bottom: 6px;
    }
    #playBackStart {
      display: inline-block;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }
}
//指定日期控件默认字体颜色
.bootstrap-datetimepicker-widget table {
  color: #333;
}
</style>
