<template>
  <div>
    <!-- <span style="color:#fff;">{{$attrs}}</span> -->
    <video-player
      v-if="live && playBack"
      :live-url="getLiveUrl(nvrAddr,channelAddr,$attrs.playing)"
      :play-back-url="getPlayBackUrl(nvrAddr,channelAddr)"
      :defaultFullScreen="defaultFullScreen"
      @dispose="dispose"
      v-bind="$attrs"
    />
    <video-player
      v-if="!live && playBack && !(start && end)"
      :play-back-url="getPlayBackUrl(nvrAddr,channelAddr)"
      @dispose="dispose"
    />
    <video-player
      v-if="!live && playBack && start && end"
      :play-back-url="getPlayBackUrl(nvrAddr,channelAddr,start,end,playBackUrl)"
      :poster="poster"
    />
  </div>
</template>
<script>
import VideoPlayer from "../lib/VideoPlayer.vue";
import {getLiveUrl, getPlayBackUrl} from "./config/api";

export default {
  name: "App",
  props: {
    nvrAddr: String,
    channelAddr: String,
    start: String,
    end: String,
    live: Boolean,
    playBack: Boolean,
    defaultFullScreen: Boolean,
    poster: String,
    playBackUrl: String
  },
  components: {
    VideoPlayer
  },
  methods: {
    dispose() {
      this.$emit("dispose");
    },
    getLiveUrl,
    getPlayBackUrl
  }
};
</script>
