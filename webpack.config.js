module.exports = {
  devServer: {
    proxy: {
        "/api/v1": {
            target: process.env.VUE_APP_VIDEO_LIVE_GBS,
            changeOrigin: true
        },
        "/video": {
            target: process.env.VIDEO_API,
            changeOrigin: true
        }
    }
  }
};
