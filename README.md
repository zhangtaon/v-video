# ty-video 视频直播录播一体化基础功能包

### 技术栈
 [videojs](https://videojs.com/) + [flv.js](https://github.com/Bilibili/flv.js#readme) + [videojs-flvjs](https://github.com/mister-ben/videojs-flvjs#readme) + [ES6](http://caibaojian.com/es6/) + [jquery@2*](https://www.jquery123.com/category/traversing/tree-traversal/) + [bootstarp@3*](https://v3.bootcss.com/) + [Bootstrap 3 Date/Time Picker](http://eonasdan.github.io/bootstrap-datetimepicker/) + [Sass](https://sass-lang.com/guide) + [Moment.js](https://momentjs.com/)

### 使用介绍

#### xxx.vue
    <script>
    import { TyPlayer } from "@ty-video";
    import poster from "./image/poster.jpg";

    export default {
        name: "App",
        components: {
            TyPlayer//绑定组件
        },
        data() {
            return {
                poster: poster //播放器封面
            };
        }
        ...
    }
    </script>
    场景一：直播 （默认直播，默认小屏加载及播放，可通过设置defaultFullScreen标记来默认全屏播放，全屏下可选择日期进行录播）
    <template>
        <ty-player :nvrAddr="nvrAddr" :channelAddr="channelAddr" live playBack />
    </template>

    场景二：录播 可选择日期（many times ）（默认录播、默认全屏暂停，需要手动选择日期进行片段播放）
    <template>
        <ty-player :nvrAddr="nvrAddr" :channelAddr="channelAddr" playBack/>
    </template>

    场景三：录播（once）（默认录播，默认小屏暂停，需要手动播放，支持全屏查看）
    <template>
        <ty-player :nvrAddr="nvrAddr" :channelAddr="channelAddr" :start="start" :end="end" :poster="poster" playBack/>
    </template>

   

#### TyPlayer props 介绍：
    nvrAddr：string （网络硬盘录像机）
    channelAddr：string （信道地址，即摄像头）
    start：string （录播开始时间）
    end：string （录播结束时间）
    poster：string （image地址，录播once的时候播放器封面图）
    defaultFullScreen: Boolean(默认全屏，目前针对直播场景添加即默认全屏直播)
    live：Boolean (直播标记)
    playBack：Boolean (录播标记)
    playBackUrl: string (回播url，指定后更改默认回播资源请求地址)

#### TyPlayer event 介绍：
    dispose：当点击播放器右上角的关闭按钮时触发


#### 异常记录
    1.录播场景：[FlvPlayer] > Maximum buffering duration exceeded, suspend transmuxing task
    2.the media playback was aborted due to a corruption...media used features your brower did not support

#### 调试现场方式
     第一步：拿到目标现场数据
     第二部：设置TyApp.vue文件 
     录播设置：找到this.playBack替换对应属性
     非固定时间段场景：设置module=2，同时还要设置api.js指定录播时间段 startTime && endTime，找到如下代码替换对应值
     if (process.env.MOCK) {
            startTime = "1584169500000";
            endTime = "1584169500000";
     }
     固定时间段场景 设置module=3
     直播设置：this.livePlay 替换对应属性 设置module=1
     第三部：启动服务 访问app
     
    