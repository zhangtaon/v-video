import axios from "axios";
import Vue from "vue";
import liveGbsHttp from "./liveGbsHttp";

const mockHls = function (id) {
    return `${process.env.VUE_APP_VIDEO_MOCK_HLS}/${id}`;
};

let isNetworkSource = process.env.MOCK+"" == "true"; //是否启用在线播放源，true使用在线源，false使用现场源

export async function getLiveUrl(serial, code, playing=true) {
    if(!playing)return;
    //沧州园区
    if (serial && code) {
        if (!isNetworkSource) {
            try {
                let res = await liveGbsHttp.get("/stream/start", {
                    params: { serial, code }
                });
                return res.HLS; //沧州园区
            } catch (e) {
                throw e;
            }
        } else {
            //在线源模式
            return mockHls(code);
        }
    } else {
        return false;
    }
}
export function getPlayBackUrl(nvrAddr, channelAddr, startTime, endTime, playBackUrl) {
    playBackUrl =
        playBackUrl ||
        `${process.env.VUE_APP_VIDEO_API_PATH}/video/queryRecorderList`;

    //在线源模式
    if (isNetworkSource) {
        playBackUrl = "/video/queryRecorderList";
    }

    let fn = async function (startTime, endTime) {
        if (process.env.MOCK) {
            startTime = "1584169500000";
            endTime = "1584169500000";
        }
        try {
            let playBack = await axios.get(playBackUrl, {
                params: { nvrAddr, channelAddr, startTime, endTime }
            });

            if (process.env.MOCK == "true") {
                playBack = playBack.data.data;
            }

            let op = {
                duration: 0,
                segments: []
            };
            if (Array.isArray(playBack)) {
                playBack.forEach(function (item) {
                    op.duration += Number(item.duration);
                    op.segments.push({ url: item.fileName, duration: item.duration });
                });
                return op;
            }else{
                if(Vue.prototype.$notify){
                    Vue.prototype.$notify.error({
                        title: "错误",
                        message: "回放数据有误"
                    });
                }
                return op;
            }
        } catch (e) {
            throw e;
        }
    };

    if (startTime && endTime) {
        return fn(startTime, endTime);
    } else {
        return fn;
    }
}