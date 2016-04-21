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

    //2、实现表格排序:按照每一个li第2个span中的内容(年龄)由小到大进行排序
    //->oLis这个容器和页面存在映射  ->ary是克隆出来的,和页面不存在映射
    //->ary/oLis中的每一项都是一个LI元素对象,每一项的内容和页面中的对应标签是有映射的
    //->console.log(oLis[0]===ary[0]);//->true
    function sortList() {
        //->转换成数组后进行排序
        var ary = utils.listToArray(oLis);
        ary.sort(function (a, b) {
            var curInn = a.getElementsByTagName("span")[1].innerHTML;
            var nexInn = b.getElementsByTagName("span")[1].innerHTML;
            var curInnNum = parseFloat(curInn), nexInnNum = parseFloat(nexInn);
            return curInnNum - nexInnNum;
        });

        //->按照ary中的最新的顺序把页面结构顺序进行改变
        var frg = document.createDocumentFragment();
        for (var i = 0, len = ary.length; i < len; i++) {
            frg.appendChild(ary[i]);
        }
        tabList.appendChild(frg);
        frg = null;
    }

    //3、绑定事件
    headList[1].onclick = function () {
        sortList();
    };
})();