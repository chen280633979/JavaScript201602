var http = require("http"),
    url = require("url"),
    fs = require("fs");

var routing = require("./nodeAPI/routing");
var userInfo = require("./nodeAPI/userInfo");

var server = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true), pathname = urlObj.pathname, query = urlObj.query;

    //->资源文件的路由判断
    var reg = /\.(TXT|JSON|HTML|CSS|JS|PNG|JPG|GIF|JPEG|SVG|ICON|ICO|MP3|OGG|WAV|MP4|WEBM|BMP)/i;
    try {
        if (reg.test(pathname)) {
            var suffix = reg.exec(pathname)[1].toUpperCase();
            var suffixType = routing.suffixType(suffix);
            var conFile = /(HTML|JSON|CSS|JS|TXT|SVG)/i.test(suffix) ? fs.readFileSync("." + pathname, "utf8") : fs.readFileSync("." + pathname);
            res.writeHead(200, {'content-type': suffixType + ";charset=utf-8"});
            res.end(conFile);
            return;
        }
    } catch (e) {
        res.writeHead(404);
        res.end();
    }

    //->数据请求接口
    var parData = null;
    if (pathname === "/addUser") {
        parData = null;
        req.addListener('data', function (chunk) {
            parData = chunk;
        });
        req.addListener('end', function () {
            parData = JSON.parse(parData);
            var result = userInfo.add(parData);
            res.writeHead(200, {"content-type": "application/json;charset=utf-8"});
            res.end(JSON.stringify(result));
        });
        return;
    }

    if (pathname === "/checkLogin") {
        parData = null;
        req.addListener('data', function (chunk) {
            parData = chunk;
        });
        req.addListener('end', function () {
            parData = JSON.parse(parData);
            var result = userInfo.checkLogin(parData["account"], parData["pass"]);
            res.writeHead(200, {"content-type": "application/json;charset=utf-8"});
            res.end(JSON.stringify(result));
        });
        return;
    }

    if (pathname === "/checkEmail") {
        parData = null;
        req.addListener('data', function (chunk) {
            parData = chunk;
        });
        req.addListener('end', function () {
            parData = JSON.parse(parData);
            var result = userInfo.checkEmail(parData["email"]);
            res.writeHead(200, {"content-type": "application/json;charset=utf-8"});
            res.end(JSON.stringify(result));
        });
        return;
    }

    if (pathname === "/getInfo") {
        var result = userInfo.getInfo(query["id"]);
        res.writeHead(200, {"content-type": "application/json;charset=utf-8"});
        res.end(JSON.stringify(result));
        return;
    }

    if (pathname === "/bannerInfo") {
        var con = fs.readFileSync("./nodeAPI/json/banner.json", "utf8");
        con = con === "" ? [] : JSON.parse(con);
        res.writeHead(200, {"content-type": "application/json;charset=utf-8"});
        res.end(JSON.stringify(con));
    }
});
server.listen(80, function () {
    console.log("服务创建成功,正在监听80端口~");
});