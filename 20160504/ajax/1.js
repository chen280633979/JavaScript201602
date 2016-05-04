//1、创建AJAX对象
//var xhr = new XMLHttpRequest;//->在部分IE(IE6/IE5)浏览器中不兼容
//var xhr = null;
//try {
//    if (window.XMLHttpRequest) {
//        xhr = new XMLHttpRequest;
//    } else if (new ActiveXObject("Microsoft.XMLHTTP")) {
//        xhr = new ActiveXObject("Microsoft.XMLHTTP");
//    } else if (new ActiveXObject("Msxml2.XMLHTTP")) {
//        xhr = new ActiveXObject("Msxml2.XMLHTTP");
//    } else if (new ActiveXObject("Msxml3.XMLHTTP")) {
//        xhr = new ActiveXObject("Msxml3.XMLHTTP");
//    }
//} catch (e) {
//    throw new Error("您的当前浏览器不支持Ajax~~");
//}
//->使用惰性思想进行封装:在执行自执行函数的之后,我们把getXHR赋值为具体的某一个函数,这样以后执行这个方法的时候就不需要在判断是哪个浏览器了
//var getXHR = null;
//(function () {
//    var list = [
//        function () {
//            return new XMLHttpRequest;//->IE7+、标准浏览器
//        }, function () {
//            return new ActiveXObject("Microsoft.XMLHTTP");
//        }, function () {
//            return new ActiveXObject("Msxml2.XMLHTTP");
//        },
//        function () {
//            return new ActiveXObject("Msxml3.XMLHTTP");
//        }
//    ];
//    var temp = null;
//    for (var i = 0; i < list.length; i++) {
//        var tempFn = list[i];
//        try {
//            temp = tempFn();
//        } catch (e) {
//            continue;
//        }
//        getXHR = tempFn;
//        break;
//    }
//    if (!temp) {
//        throw new Error("您的当前浏览器不支持AJAX!");
//    }
//})();

//->第一次执行的是最开始的大方法,返回的是XHR对象,但是在第一次执行的时候,我们在方法中把我们的getXHR重新的进行覆盖了,第二次执行的时候只需要执行最后覆盖的那个小的函数即可
var getXHR = function () {
    var list = [
        function () {
            return new XMLHttpRequest;//->IE7+、标准浏览器
        }, function () {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }, function () {
            return new ActiveXObject("Msxml2.XMLHTTP");
        },
        function () {
            return new ActiveXObject("Msxml3.XMLHTTP");
        }
    ];
    var temp = null;
    for (var i = 0; i < list.length; i++) {
        var tempFn = list[i];
        try {
            temp = tempFn();
        } catch (e) {
            continue;
        }
        getXHR = tempFn;
        break;
    }
    if (!temp) {
        throw new Error("您的当前浏览器不支持AJAX!");
    }
    return temp;
};
var xhr = getXHR();


//2、打开一个URL地址(服务器给我们的数据请求的接口(API)地址)
//->API:Application Programming Interface(应用程序接口) 只要是提供其他人使用的入口都叫做接口(例如:服务器给我们的URL地址、我们写一些公用的方法...)


//->HTTP METHOD:
//请求方式(GET、POST、PUT、DELETE...),最常用的就是GET/POST
//GET:一般应用于向服务器发送一个请求,从服务器获取到内容
//POST:一般应用于客户端给服务器推送大量的内容

//->但是不管哪个请求都可以在REQUEST阶段发送给服务器一些数据,在RESPONSE阶段把服务器返回的数据接收;一般GET以获取为主,POST以推送为主;
//->xhr.open("get","http://localhost/userInfo?xxx=xxx"); ->通过GET请求向服务器传送数据,是把需要传递的内容通过URL问号传参的方式传递给后台服务器的
//->POST请求是把需要传递给服务器的数据写在SEND中(格式必须是字符串格式的)
//xhr.open("post", "http://localhost/userInfo");
//xhr.send('{"name":"珠峰","age":7}');

//->GET和POST的区别
//1)"安全":GET传送给服务器的内容是在UEL后面拼接上的,可以在控制台查看到;POST是把传递的内容放在HTTP主体中传给服务器的,在控制台看不到;所以POST请求更加的安全;GET请求很容易让黑客进行URL劫持;

//2)"长度":因为GET是把内容拼接在URL后面的,而每一个浏览器对于URL的长度有大小的限制(谷歌->8KB 火狐->7KB IE->2KB),这样话,如果我们传递给服务器的内容过多,超过长度的部分,浏览器会自动截取掉,我们传递给后台的数据不完整了;对于这样的情况(需要传递很多内容),我们使用POST请求;
//->例如:用户注册,用户需要填写很多信息,而且我们需要把所有的信息都传递给服务器,此时我们一般都是使用POST进行处理的

//3)"缓存":POST请求,浏览器不会默认记录缓存信息,我们也不需要清理缓存信息;但是GET请求,浏览器会自己创建一个缓存,我们第二次获取的请求内容很有可能是上一次获取的内容,这样无法随时获取最新的数据了;->我们如果使用的是GET请求,还需要在每一次URL的地址后面多增加一个参数_=Math.random(),这样保证每一次请求的地址都是不一样的,也不会在走缓存数据了
//xhr.open("get", "http://localhost/userInfo?_=" + Math.random());
//xhr.open("get", "http://localhost/userInfo?name=zf&_=" + Math.random());

var url = "http://localhost/userInfo?name=zf", charStr = url.indexOf("?") > -1 ? "&" : "?";
url += charStr + "_=" + Math.random();
xhr.open("get", url);