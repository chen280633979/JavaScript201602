var xhr = new XMLHttpRequest;
//->地址：服务器端数据接口的地址,我们通过这个地址把数据请求回来;这个地址是服务器端提供的
//->假设服务器端提供的地址是:http://localhost/userInfo?name=xxx 通过这个数据接口我可以把指定用户名的人员信息获取到
xhr.open("get", "http://localhost/userInfo?name=肖金风", false);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
        var val = xhr.responseText;
        val = JSON.parse(val);
        console.log(val);
    }
};
xhr.send(null);

