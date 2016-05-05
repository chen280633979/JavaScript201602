//->使用惰性思想封装的一个获取AJAX对象的方法
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

//->apiurl:服务器端请求的接口地址
//->callback:请求成功后要处理的事情
function ajax(apiurl, callback) {
    var xhr = getXHR();
    //->添加一个随机数清除缓存
    apiurl += apiurl.indexOf("?") > -1 ? "&_=" + Math.random() : "?_=" + Math.random();
    xhr.open("get", apiurl, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
            var val = xhr.responseText;
            val = "JSON" in window ? JSON.parse(val) : eval("(" + val + ")");
            callback(val);
        }
    };
    xhr.send(null);
}