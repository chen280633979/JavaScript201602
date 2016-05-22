//->如果传递进来的请求方式是post,需要把传递给服务器的数据data传递给函数
function ajax(type, url, async, callback, data) {
    var xhr = new XMLHttpRequest;
    if (type === "get") {
        if (url.indexOf("?") > -1) {
            url += "&_=";
        } else {
            url += "?_=";
        }
        url += Math.random();
    }
    xhr.open(type, url, async);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
            callback && callback(JSON.parse(xhr.responseText));
        }
    };
    if (type === "post") {
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send(null);
    }
}