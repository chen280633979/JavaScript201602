var http = require("http");
//->http.createServer:创建一个服务

var url = require("url");
//->url.parse:把一个URL地址进行解析

var fs = require("fs");
//->fs.readFileSync([请求文件的地址],[编码格式]):同步读取本地文件中的内容,并且获取到的内容都是一个字符串


//->我们的匿名回调函数中包含两个形参:
//request->操作的是客户端给服务器端发送的请求信息
//response->操作的是服务器端返回给客户端的信息
var server = http.createServer(function (request, response) {
    //[REQUEST]
    //->request.url:获取到的是客户端请求的URL地址(包含问号后面传递进来的参数值)
    var urlObj = url.parse(request.url, true);
    var pathname = urlObj["pathname"], query = urlObj["query"];

    //->前端路由判断
    if (pathname === "/index.html") {
        //->客户端请求的地址是http://localhost/index.html,我们需要把index.html页面中的内容获取到并且返回给客户端进行渲染
        var con = fs.readFileSync("./index.html", "utf8");

        //->把获取的内容返回给客户端
        //1)编写响应头信息:第一个是网络状态码,第二个是响应给客户端内容的格式
        response.writeHead(200, {'content-type': 'text/html'});
        //2)编写响应主体信息:把内容返回
        response.write(con);
        response.end();//->响应结束,这个一定要加,否则本次请求响应是不会自己结束的,客户端等到响应结束后才会进行渲染
    }
});
server.listen(80);

//->前端路由:服务器端接收到客户端的请求内容,根据请求的不一样,我们返回给客户端不同的内容 ->这个就是服务器的主要职责之一