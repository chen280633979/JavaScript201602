//->解析URL问号后面传递参数的方法
function queryURLParameter(url) {
    var obj = {}, reg = /([^?&=_]+)=([^?&=]+)/g;
    var res = reg.exec(url);
    while (res) {
        obj[res[1]] = res[2];
        res = reg.exec(url);
    }
    return obj;
}

if (typeof module !== "undefined") {
    module.exports = {
        queryURLParameter: queryURLParameter
    };
}



