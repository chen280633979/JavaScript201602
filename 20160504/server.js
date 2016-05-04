var http = require("http");
var url = require("url");
var fs = require("fs");
var server = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true);
    var pathname = urlObj["pathname"], query = urlObj["query"];
    
    //->请求的都是HTML/CSS/JS文件
    if (/(css|js|html)/i.test(pathname)) {
        //->获取pathname中的后缀名,来确定content-type的类型
        var lastName = (pathname.substring(pathname.indexOf(".") + 1)).toLowerCase();
        var contentType = lastName === "css" ? "text/css" : (lastName === "js" ? "text/javascript" : "text/html");
        var con = fs.readFileSync("." + pathname, "utf8");
        response.writeHead(200, {'content-type': contentType});
        response.end(con);
        return;
    }

    //->处理所有的图片
    if (/(jpg|png|gif)/i.test(pathname)) {
        lastName = (pathname.substring(pathname.indexOf(".") + 1)).toLowerCase();
        contentType = lastName === "gif" ? "image/gif" : (lastName === "png" ? "image/png" : "image/jpeg");
        var imgCon = fs.readFileSync("." + pathname);
        response.writeHead(200, {'content-type': contentType});
        response.end(imgCon);
        return;
    }

    //->向客户端提供一个数据接口:接收到客户端的请求,把userInfo.json文件中的指定内容返回给客户端
    //http://localhost/userInfo?name=xxx
    if (pathname === "/userInfo") {
        //->读取内容
        var jsonStr = fs.readFileSync("./json/userInfo.json", "utf8");
        var jsonObj = JSON.parse(jsonStr);

        //->把name等于xxx的这项内容获取到
        var res = {};
        for (var i = 0; i < jsonObj.length; i++) {
            var cur = jsonObj[i];
            //->query包含的是所有请求中传递进来的参数
            if (cur.name === query.name) {
                res = cur;
                break;
            }
        }

        //->把获取的res返回给客户端
        response.writeHead(200, {'content-type': 'application/json'});
        response.end(JSON.stringify(res));//->我们返回给客户端的数据内容需要是一个JSON格式的字符串才可以
    }
});
server.listen(80);