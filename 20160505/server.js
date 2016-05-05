var http = require("http");
var url = require("url");
var fs = require("fs");
var utils = require("./module/utils");

var getInfo = require("./module/getInfo");
var addInfo = require("./module/addInfo");
var updateInfo = require("./module/updateInfo");
var deleteInfo = require("./module/deleteInfo");
var detailInfo = require("./module/detailInfo");

//->使用NODE创建一个服务:当客户端发送一次请求的时候就会把对应的回调函数执行,并且传递两个参数值REQUEST、RESPONSE
var server = http.createServer(function (req, res) {
    //->解析客户端发送请求的这个地址
    var urlObj = url.parse(req.url);
    var pathname = urlObj.pathname, query = utils.queryURLParameter(decodeURIComponent(urlObj.query));
    //->我们使用url.parse最后一个参数传递的是true,会自动把传递进来的参数进行解析,但是获取到的对象不支持hasOwnProperty这个方法,所以我们自己写一个方法实现即可

    //->前端路由判断:HTML/JS/CSS文件读取,并且返回给客户端进行解析
    var reg = /\.(html|css|js)/i;
    if (reg.test(pathname)) {
        var fileCon = fs.readFileSync("." + pathname, "utf8");
        var suffix = reg.exec(pathname)[1];
        var conType = suffix === "html" ? "text/html" : (suffix === "css" ? "text/css" : "text/javascript");
        res.writeHead(200, {'content-type': conType});
        res.end(fileCon);
        return;
    }

    //->获取全部客户信息的接口
    if (pathname === "/getInfo") {
        getInfo.init(res);
        return;
    }

    //->增加用户信息的接口
    if (pathname === "/addInfo") {
        addInfo.init(query, res);
        return;
    }

    //->增加用户信息的接口
    if (pathname === "/updateInfo") {
        updateInfo.init(query, res);
        return;
    }

    //->删除用户信息的接口
    if (pathname === "/deleteInfo") {
        deleteInfo.init(query, res);
    }

    //->获取详细信息的接口
    if (pathname === "/detailInfo") {
        detailInfo.init(query, res);
    }
});
server.listen(9876, function () {
    console.log("NODE服务已经成功启动,正在监听'9876'这个端口!");
});