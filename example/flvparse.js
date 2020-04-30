const flv = require('flv-reader')
var path = require("path");
console.log("flv................");
// 如果是解析本地的flv视频
flv(__dirname + '/video/bbb.flv').info(function(msg){
    console.log(msg)
})
// 如果是通过http请求获取的flv视频
// flv('http://example.com/demo.flv').info(function(msg){
//     console.log(msg)
// })
// console.log(path.resolve("."))
// console.log(path.resolve(__dirname))