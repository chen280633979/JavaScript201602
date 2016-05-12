var http = require("http");
var url = require("url");
var fs = require("fs");
var server = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true);
    var pathname = urlObj.pathname, query = urlObj.query;

    //->HTML/CSS/JS文件的读取返回
    var reg = /\.(HTML|CSS|JS)/i;
    if (reg.test(pathname)) {
        var suffix = (reg.exec(pathname)[1]).toUpperCase();
        var conType = suffix === "HTML" ? "text/html" : (suffix === "CSS" ? "text/css" : "text/javascript");
        var fileText = fs.readFileSync("." + pathname, "utf8");
        response.writeHead(200, {'content-type': conType});
        response.end(fileText);
        return;
    }

    //->编写AJAX请求数据的API
    if (pathname === "/getData") {
        //->首先获取所有的数据,然后根据(pageNum)把客户端需要请求的那pageCount条数据返回
        var data = fs.readFileSync("./json/data.json", "utf8");
        data = JSON.parse(data);

        //->计算总页数
        var total = Math.ceil(data.length / query.pageCount);

        //->根据条数和页数获取需要的数据
        var ary = [];
        for (var i = (query.pageNum - 1) * query.pageCount; i <= (query.pageNum * query.pageCount) - 1; i++) {
            var cur = data[i];
            if (!cur) {
                break;
            }
            ary.push(cur);
        }

        response.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        response.end(JSON.stringify({total: total, data: ary}));
        return;
    }

    //->如果客户端请求的地址不存在的话,我们返回一个404页面
    response.writeHead(404, {'content-type': 'text/html'});
    response.end(fs.readFileSync("./404.html", "utf8"));
});
server.listen(80, function () {
    console.log("服务启动成功!");
});