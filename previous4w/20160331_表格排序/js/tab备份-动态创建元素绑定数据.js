var oTab = document.getElementById("tab");
var tBody = oTab.tBodies[0];
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

//2、绑定数据
~function () {
    for (var i = 0, len = jsonData.length; i < len; i++) {
        var curData = jsonData[i];

        //->重写每一个对象中的sex属性的值,把0~2替换为男/女/未知
        curData["sex"] = curData["sex"] == 0 ? "男" : (curData["sex"] == 1 ? "女" : "未知");

        var oTr = document.createElement("tr");
        for (var key in curData) {
            var oTd = document.createElement("td");
            oTd.innerHTML = curData[key];
            oTr.appendChild(oTd);
        }
        tBody.appendChild(oTr);

        //->这种方式虽然兼容了所有的浏览器,但是性能不是很好,引发了多次的DOM回流,每创建一个tr,都立即添加到页面,这样就引发一次回流,循环结束一共引发六次回流...
        //DOM回流:如果页面中的HTML结构发生改变(增加、删除、元素的位置变化了...),浏览器就需要重新的计算一遍DOM结构 ->回流相对来说比较的耗性能,所以我们尽量减少DOM的回流次数
        //DOM重绘:某一个元素的部分样式改变(背景颜色...),浏览器只需要把当前元素的重新的渲染一遍即可,对其他的没有影响
    }
}();

//3、实现奇数行和偶数行变颜色
function changeBg() {
    for (var i = 0; i < oRows.length; i++) {
        oRows[i].className = i % 2 === 1 ? "bg" : null;
    }
}
changeBg();