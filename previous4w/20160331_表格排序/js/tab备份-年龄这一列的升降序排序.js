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
    oThs[1].flag *= -1;

    //->1)把存储所有行的类数组转换为数组
    var ary = utils.listToArray(oRows);

    //->2)按照每一行第二列(年龄这一列)里面的内容,由小到大进行排序
    ary.sort(function (a, b) {
        var curInn = a.cells[1].innerHTML;
        var nexInn = b.cells[1].innerHTML;
        var curInnNum = parseFloat(curInn);
        var nexInnNum = parseFloat(nexInn);

        return (curInnNum - nexInnNum) * oThs[1].flag;
    });

    //->3)在按照数组中最新排好的顺序添加到页面中
    var frg = document.createDocumentFragment();
    for (var i = 0, len = ary.length; i < len; i++) {
        frg.appendChild(ary[i]);
    }
    tBody.appendChild(frg);//->DOM映射:http://www.zhufengpeixun.cn/course/22/learn#lesson/538

    //->4)按照现有的顺序从新的实现隔行变色
    changeBg();
}

//5、给年龄这一列绑定点击事件,点击的时候实现排序
oThs[1].flag = -1;//->给第二列加一个自定义属性flag,初始值值-1
oThs[1].onclick = function () {
    sortTab();
};

//在第一次点击之前 flag=-1;
//第一次点击:flag*=-1 ->flag=1
//第二次点击:











