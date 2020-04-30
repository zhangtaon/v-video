/**
 * authro zto
 * date: 2019-8-9
 * 日期控件service
 */
import tmpl from "./TyPlayBack.html";
import videoConstant from "../videoConstant";
import moment from "moment";
import $ from "jquery";
import { log } from "./util";

let player;
let liveSource;
let $start;
let $end;
let $tmpl;

/**
 * 回放服务初始化
 */
function initService() {
  $tmpl = $(tmpl);
  $start = $tmpl.find("#datetimepickerstart");
  $end = $tmpl.find("#datetimepickerend");
  let $playBackStart = $tmpl.find("#playBackStart");

  $start.datetimepicker({
    format: "YYYY-MM-DD HH:mm",
    locale: moment.locale("zh-cn")
  });
  $end.datetimepicker({
    format: "YYYY-MM-DD HH:mm",
    locale: moment.locale("zh-cn"),
    useCurrent: false //Important! See issue #1075
  });
  var now = moment();
  // console.log("当前日期:",now.clone().date(now.date()-6).format("YYYY-MM-DD 00:00:00"));
  $start.data("DateTimePicker").maxDate(now);
  $start.data("DateTimePicker").minDate(now.clone().hour(0).minute(0).seconds(0).millisecond(0).subtract(10, "d"));
  $end.data("DateTimePicker").maxDate(now);


  $start.on("dp.change", function (e) {
    //清空的时候e.data为false，故不做处理
    if (!e.date) {
      return;
    }
    $end.data("DateTimePicker").minDate(e.date.clone());
  });
  $start.data("DateTimePicker").date(now);
  $end.data("DateTimePicker").date(now);

  $end.on("dp.change", function (e) { });

  // 播放源切换事件
  $playBackStart.on("click", function (e) {
    let tyPlayBack = player.controlBar.getChild("TyPlayBack");
    let $pb = $(tyPlayBack.el_);
    $pb.popover("destroy");
    $pb.toggleClass("playback").on("click", function () {
      $pb.off('click')

      let controlTitleBar = player.controlBar.getChild("TyControlTitleBar");
      if(controlTitleBar){
        controlTitleBar.trigger("popText");
      }

      if (liveSource) {
        changeSource(null, liveSource);//直播切换
      } else {
        stopSource();
      }

      $pb.toggleClass("playback");
      $pb.popover({
        html: true,
        content: () => {
          return $tmpl;
        },
        placement: "top"
      });
    });

    playBack();//录播切换
  });

  // 回放
  let playBack = async function () {
    try {
      let startTime = $start
        .data("DateTimePicker")
        .viewDate()
        .valueOf();
      let endTime = $end
        .data("DateTimePicker")
        .viewDate()
        .valueOf();

      let controlTitleBar = player.controlBar.getChild("TyControlTitleBar");
      if(controlTitleBar){
        controlTitleBar.trigger("pushText", `${moment(startTime).format("YYYY年MM月DD日 HH:mm:ss ")}-${moment(endTime).format(" YYYY年MM月DD日 HH:mm:ss")}`);
      }
      player.trigger("playback", {
        startTime,
        endTime,
        callback(data) {
          log("playback:", data);
          Object.assign(player.options_.flvjs.mediaDataSource, data);
          changeSource(null, "-1", videoConstant.flv);
        }
      });
    } catch (e) {
      throw e;
    }
  };
}

/**
 * 切换播放源(直播hls m3u8互切 & 直播与录播flv互切)
 * author zto
 * @param {string} src 播放源
 * @param {string} type 播放类型
 * @param {player} $player 播放器
 */
function changeSource($player, src, type) {
  // src = "/video/loadRecord?videoName=20190902/117/117_20190902130510.flv"; 回播url格式
  $player = $player || player;
  let logText;
  if ($player.src() != src) {
    if(!src){
      src = $player.src();
      logText = "播放源重连成功"
    }else{
      logText = "播放源切换成功"
    }
    $player.pause();
    stopSource($player);
    $player.src({ type: type || videoConstant.hls, src: src });
    $player.ready(function () {
      console.log(logText);
    });
  }
}

/**
 * 停止录播播放
 * @param {*} $player 
 */
function stopSource($player) {
  $player = $player || player;
  $player.reset();
  $player.muted(true);
  $player.autoplay(true);
}

//清空日志控件的值
let clearDateTime = function () {
  $start.data("DateTimePicker").clear();
  $end.data("DateTimePicker").clear();
};

function playbackTmplService($player) {
  player = $player;
  liveSource = player.src();
  initService();
  return $tmpl;
}
export { clearDateTime, playbackTmplService, changeSource, stopSource };
