var oTab = document.getElementById("tab");
var tHead = oTab.tHead;
var oThs = tHead.rows[0].cells;
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
    var frg = document.createDocumentFragment();//->创建一个文档碎片用来临时的存储我们创建的tr
    for (var i = 0, len = jsonData.length; i < len; i++) {
        var curData = jsonData[i];
        curData["sex"] = curData["sex"] == 0 ? "男" : (curData["sex"] == 1 ? "女" : "未知");

        var oTr = document.createElement("tr");
        for (var key in curData) {
            var oTd = document.createElement("td");
            oTd.innerHTML = curData[key];
            oTr.appendChild(oTd);
        }
        frg.appendChild(oTr);
    }
    tBody.appendChild(frg);
    frg = null;
}();

//3、实现奇数行和偶数行变颜色
function changeBg() {
    for (var i = 0; i < oRows.length; i++) {
        oRows[i].className = i % 2 === 1 ? "bg" : null;
    }
}
changeBg();

//4、实现排序
function sortTab(n) {//->n当前点击那一列的索引
    var _this = this;
    _this.flag *= -1;

    var ary = utils.listToArray(oRows);
    ary.sort(function (a, b) {
        var curInn = a.cells[n].innerHTML, nexInn = b.cells[n].innerHTML, curInnNum = parseFloat(curInn), nexInnNum = parseFloat(nexInn);
        //->如果当前这一列排序的内容是数字,我们使用相减的方式,如果不是数字用localeCompare...
        if (isNaN(curInnNum) || isNaN(nexInnNum)) {
            return (curInn.localeCompare(nexInn)) * _this.flag;
        }
        return (curInnNum - nexInnNum) * _this.flag;
    });

    var frg = document.createDocumentFragment();
    for (var i = 0, len = ary.length; i < len; i++) {
        frg.appendChild(ary[i]);
    }
    tBody.appendChild(frg);
    changeBg();
}

//5、绑定点击事件:给所有列中具有class="cursor"这个样式类名的都加点击事件,点击的话都可以进行排序
for (var i = 0, len = oThs.length; i < len; i++) {
    var curTh = oThs[i];
    if (curTh.className.indexOf("cursor") > -1) {//->只要当前列包含这个样式就代表是可以进行排序的
        curTh.flag = -1;
        curTh.index = i;
        curTh.onclick = function () {
            sortTab.call(this, this.index);
        };
    }
}