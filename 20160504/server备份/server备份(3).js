var http = require("http");
var url = require("url");
var fs = require("fs");
var server = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true);
    var pathname = urlObj["pathname"], query = urlObj["query"];
    if (pathname === "/index.html") {
        var con = fs.readFileSync("./index.html", "utf8");
        response.writeHead(200, {'content-type': 'text/html'});
        response.end(con);
        return;
    }

    if (pathname === "/css/common.css") {
        var conStyle = fs.readFileSync("." + pathname, "utf8");
        response.writeHead(200, {'content-type': 'text/css'});
        response.end(conStyle);
        return;
    }

    if (pathname === "/js/index.js") {
        var conJS = fs.readFileSync("." + pathname, "utf8");
        response.writeHead(200, {'content-type': 'text/javascript'});
        response.end(conJS);
    }
});
server.listen(80);