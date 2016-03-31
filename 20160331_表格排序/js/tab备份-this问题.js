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

//4、实现年龄这一列的由小到大排序
function sortTab() {
    var _this = this;//->_this是oThs[1]
    _this.flag *= -1;

    var ary = utils.listToArray(oRows);
    ary.sort(function (a, b) {
        //this->window
        var curInn = a.cells[1].innerHTML;
        var nexInn = b.cells[1].innerHTML;
        var curInnNum = parseFloat(curInn);
        var nexInnNum = parseFloat(nexInn);
        return (curInnNum - nexInnNum) * _this.flag;
    });

    var frg = document.createDocumentFragment();
    for (var i = 0, len = ary.length; i < len; i++) {
        frg.appendChild(ary[i]);
    }
    tBody.appendChild(frg);
    changeBg();
}

//5、给年龄这一列绑定点击事件,点击的时候实现排序
oThs[1].flag = -1;
oThs[1].onclick = function () {
    //this->oThs[1] 给元素的点击行为绑定事件

    //sortTab();//->sortTab中的this->window 方面名前面没有"."
    //sortTab.call(oThs[1]);//->sortTab中的this->oThs[1]
    sortTab.call(this);
};











