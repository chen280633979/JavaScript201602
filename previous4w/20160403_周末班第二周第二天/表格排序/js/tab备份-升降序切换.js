(function () {
    var jsonData = utils.formatJSON(jsonStr);
    var tabList = document.getElementById("tabList"), oLis = tabList.getElementsByTagName("li");
    var tabHead = document.getElementById("tabHead"), headList = tabHead.getElementsByTagName("span");

    //1、实现我们的数据绑定
    ~function () {
        var frg = document.createDocumentFragment();
        for (var i = 0, len = jsonData.length; i < len; i++) {
            var curData = jsonData[i];
            curData["sex"] = curData["sex"] === 0 ? "男" : (curData["sex"] === 1 ? "女" : "未知");

            var oLi = document.createElement("li");
            for (var key in curData) {
                var oSpan = document.createElement("span");
                oSpan.innerHTML = curData[key];
                oLi.appendChild(oSpan);
            }
            frg.appendChild(oLi);
        }
        tabList.appendChild(frg);
        frg = null;
    }();

    //2、实现表格排序
    function sortList() {
        headList[1].flag *= -1;//->每一次点击都在自己标识的基础上*=-1

        var ary = utils.listToArray(oLis);
        ary.sort(function (a, b) {
            var curInn = a.getElementsByTagName("span")[1].innerHTML;
            var nexInn = b.getElementsByTagName("span")[1].innerHTML;
            var curInnNum = parseFloat(curInn), nexInnNum = parseFloat(nexInn);
            return (curInnNum - nexInnNum) * headList[1].flag;
        });

        var frg = document.createDocumentFragment();
        for (var i = 0, len = ary.length; i < len; i++) {
            frg.appendChild(ary[i]);
        }
        tabList.appendChild(frg);
        frg = null;
    }

    //3、绑定事件
    //升降序切换的原理：
    //给当前点击的这一列增加一个标识,初始值-1
    //每一次点击后，在排序之前先让标识*=-1,这样的话,每一次点击我们的标识都在1/-1之间来回的切换
    //在排序的时候，return (curInnNum - nexInnNum)*标识,这样的话每一次的排序也会根据标识的切换进行切换
    headList[1].flag = -1;//->给当前点击这一列增加一个标识flag=-1
    headList[1].onclick = function () {
        sortList();
    };
})();