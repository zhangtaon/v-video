import axios from "axios";

let liveGbsHttp;
/**
 * 初始化第三方视频平台请求http服务
 * @param {String} url
 */
function initLiveGbsHttp(url) {
  url = url || "";
  liveGbsHttp = axios.create({
    baseURL: url + "/api/v1"
  });
}

if (process.env.MOCK=="true") {
  initLiveGbsHttp();
} else {
  initLiveGbsHttp(process.env.VUE_APP_VIDEO_LIVE_GBS);
}

liveGbsHttp.interceptors.response.use(
  function(response) {
    if (response.data) {
      return response.data;
    } else {
     
      return Promise.reject(response.data);
    }
  },
  function(error) {
    // Do something with response error
    let msg;
    switch (error.response.status) {
      case 403:
        msg = "请求被屏蔽";
        break;
      case 404:
        msg = "请求未找到";
        break;
      case 405:
        msg = "请求不被允许";
        break;
      case 500:
        msg = "服务器错误";
        break;
      default:
        msg = "请求出错";
        break;
    }
    console.warn("LiveGBS接口错误:",error);

    // console.group("LiveGBS接口错误");
    //   console.warn(`请求接口：${error.response.config.url}`);
    //   if (response.config.params) {
    //     console.warn(`请求参数：${JSON.stringify(error.response.config.params)}`);
    //   }
    //   console.warn(`错误描述：${error.response.data}`);
    //   console.warn(`错误码：${error.response.status}`);
      // console.groupEnd();
    return Promise.reject(error);
  }
);
export default liveGbsHttp ;
