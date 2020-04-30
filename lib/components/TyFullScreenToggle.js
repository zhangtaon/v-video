/**
 * authro zto
 * date: 2019-7-29
 * video播放器全屏组件
 * 组件对外暴露事件：
 * 1.切换全屏 toggleFullScreen
 */
import $ from "jquery";
import {log} from "./util";

var Component = videojs.getComponent("Component");

// The videojs.extend function is used to assist with inheritance. In
// an ES6 environment, `class TitleBar extends Component` would work
// identically.
var TyFullScreenToggle = videojs.extend(Component, {
  // The constructor of a component receives two arguments: the
  // player it will be associated with and an object of options.
  constructor: function TyFullScreenToggle(player, options) {
    // It is important to invoke the superclass before anything else,
    // to get all the features of components out of the box!
    Component.apply(this, arguments);
    this.player = player;
    this.options = options;
    this.controlBarChilds = options.controlBarChilds || { ...this.options.customeBar, playToggle: "", volumePanel: "", progressControl: "", remainingTimeDisplay: "" };
  },

  // The `createEl` function of a component creates its DOM element.
  createEl: function () {
    var ele = videojs.dom.createEl("span", {
      // Prefixing classes of elements within a player with "vjs-"
      // is a convention used in Video.js.
      className:
        "vjs-control vjs-fullscreen-control vjs-icon-fullscreen-enter vjs-full-screen-btn "
    });
    videojs.on(
      ele,
      "click",
      videojs.bind(this, function () {
        // var $titleBar;
        // if (this.player.childNameIndex_.TitleBar) {
        //   $titleBar = $(this.player.childNameIndex_.TitleBar.el_);
        // }

        //自定义全屏播放器切换
        videojs.dom.toggleClass(this.player.el_, "video-full-screen");
        
        //自定义播放器全屏辅助样式切换
        videojs.dom.toggleClass(document.body, "full-screen");
        
        //视频全屏状态控制
        if (videojs.dom.hasClass(this.player.el_, "video-full-screen")) {

          // 由于按钮位置的关系需要先移除组件
          this.player.controlBar.removeChild("TyFullScreenToggle");

          //添加控制栏组件
          Object.keys(this.controlBarChilds).forEach((key) => {
            if(this.controlBarChilds[key]){
              this.player.controlBar.addChild(key,this.controlBarChilds[key]);
            }else{
              this.controlBarChilds[key] = this.player.controlBar.addChild(key);
            }
          })

          //处理播放状态
          if(!this.player.paused()){
            this.controlBarChilds.playToggle.handlePlay();
          }

          // 更新静音状态
          this.controlBarChilds.volumePanel.muteToggle.update();

          //全屏状态下是否禁用退出全屏按钮
          if (!this.options.disabledExitFullScreen) {

            //由于位置关系事先被移除，待其他按钮初始化成功后，重新初始化
            var fullBtn = this.player.controlBar.addChild("TyFullScreenToggle", {
              ...this.options,controlBarChilds: this.controlBarChilds
            });
            fullBtn.toggleClass("vjs-icon-fullscreen-exit");

            //暴露切换全屏事件
            fullBtn.on("toggleFullScreen", function (e) {
              e.target.click();
            });
          }
          this.player.trigger("fullscreen");
        } else {

          //退出全屏 隐藏回放面板
          if(this.controlBarChilds.playBack){
            $(this.controlBarChilds.playBack.el_).popover("hide");
          }

          //退出全屏 开启静音
          this.player.muted(true);

          //退出全屏 移除控制栏组件
          Object.keys(this.controlBarChilds).forEach((key) => {
            this.player.controlBar.removeChild(key);
            if(key != "TyControlTitleBar"){
              this.controlBarChilds[key] = "";
            }
          })

          //由于删除后又重新创建，此时的this为创建后的组件上下文
          this.toggleClass("vjs-icon-fullscreen-exit");

          this.player.trigger("exitFullscreen");
        }
      })
    );
    return ele;
  }
});

// Register the component with Video.js, so it can be used in players.
videojs.registerComponent("TyFullScreenToggle", TyFullScreenToggle);
