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
function sortTab(n) {
    //在点击当前列的时候,让其他类的flag都回归初始值-1即可
    for (var k = 0; k < oThs.length; k++) {
        k != n ? oThs[k].flag = -1 : null;
    }

    var _this = this;
    _this.flag *= -1;

    var ary = utils.listToArray(oRows);
    ary.sort(function (a, b) {
        var curInn = a.cells[n].innerHTML, nexInn = b.cells[n].innerHTML, curInnNum = parseFloat(curInn), nexInnNum = parseFloat(nexInn);
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

//5、绑定点击事件
for (var i = 0, len = oThs.length; i < len; i++) {
    var curTh = oThs[i];
    if (curTh.className.indexOf("cursor") > -1) {
        curTh.flag = -1;
        curTh.index = i;
        curTh.onclick = function () {
            sortTab.call(this, this.index);
        };
    }
}

//->我们第一次点击年龄,它的flag=1,实现了升序
//->我点击性别,按照性别排,但是年龄那一列乱序了
//->当我在点击年龄,此时应该重新按照升序排列,但是第一次的flag变为了1,点击其他列的时候一直没有改变,一直还是1,导致了在点击的时候是按照降序排列的...


//->记住周老师的一句话:"一个人到底有多牛X，不在乎它工作了多长时间，也不在乎做了多少个牛X轰轰的项目，和学历、年龄没有半毛钱的关系，主要在于他是如何对待每一个项目的，有没有尽自己的最大努力和细心把项目做的接近完美"





