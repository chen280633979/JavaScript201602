var http = require("http");
var url = require("url");
var fs = require("fs");

//->使用NODE创建一个服务器环境:协议->HTTP 域名->localhost 端口号->6666
//->以后在客户端发送请求(http://localhost:1990) 就可以把我们的回调匿名函数执行了
var server = http.createServer(function () {
    console.log("ok");
});

//->设置一个监听的端口号:设置成功后执行后面的回调函数
server.listen(80, function () {
    console.log("正在监听~");
});



