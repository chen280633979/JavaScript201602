//->导入三个NODE内置的模块
var http = require("http");//->管理服务的
var url = require("url");//->解析URL的
var fs = require("fs");//->文件读写的

//->HTTP
//->createServer:创建一个服务器的环境(SERVER) ->创建一个服务()
http.createServer();