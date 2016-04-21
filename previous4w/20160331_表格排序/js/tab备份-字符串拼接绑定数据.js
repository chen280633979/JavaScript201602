//->获取#tab这个table中所有tBody中的第一个
var oTab = document.getElementById("tab");
var tBody = oTab.tBodies[0];

//->获取tBody下所有的行
var oRows = tBody.rows;


//1、获取数据和解析数据
var jsonData = null;
~function () {
    var xhr = new XMLHttpRequest;
    xhr.open("get", "json/userInfo.txt", false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
            var str = xhr.responseText;
            jsonData = utils.formatJSON(str);
        }
    };
    xhr.send(null);
}();

//2、绑定数据:循环jsonData,把需要绑定的数据和对应的HTML标签整体都拼接为一个字符串,最后把整个字符串通过innerHTML增加到tBody中
~function () {
    //->"字符串拼接":循环请求回来的数据,然后进行字符串拼接
    var str = "";
    for (var i = 0, len = jsonData.length; i < len; i++) {
        var curData = jsonData[i];
        str += "<tr>";
        for (var key in curData) {
            str += "<td>" + curData[key] + "</td>";
        }
        str += "</tr>";
    }
    tBody.innerHTML = str;//->在IE6~9浏览器中,我们使用字符串拼接的方式绑定数据,对于其它的标签是没有问题的,但是对于table表格中的来说是不兼容的 ->需要换一种方式:动态创建元素对象的方式
}();

//3、实现奇数行和偶数行变颜色
function changeBg() {
    for (var i = 0; i < oRows.length; i++) {
        oRows[i].className = i % 2 === 1 ? "bg" : null;
    }
}
changeBg();

