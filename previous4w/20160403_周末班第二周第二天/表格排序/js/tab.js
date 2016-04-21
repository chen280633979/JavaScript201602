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
    function sortList(n) {//->n:当前点击排序这一列的索引
        var _this = this;
        _this.flag *= -1;

        var ary = utils.listToArray(oLis);
        ary.sort(function (a, b) {
            var curInn = a.getElementsByTagName("span")[n].innerHTML;
            var nexInn = b.getElementsByTagName("span")[n].innerHTML;
            var curInnNum = parseFloat(curInn), nexInnNum = parseFloat(nexInn);
            if (isNaN(curInnNum) || isNaN(nexInnNum)) {
                return (curInn.localeCompare(nexInn)) * _this.flag;
            }
            return (curInnNum - nexInnNum) * _this.flag;
        });

        var frg = document.createDocumentFragment();
        for (var i = 0, len = ary.length; i < len; i++) {
            frg.appendChild(ary[i]);
        }
        tabList.appendChild(frg);
        frg = null;
    }

    //3、绑定事件
    for (var i = 0, len = headList.length; i < len; i++) {
        var curHead = headList[i];
        if (curHead.className !== "cursor") {
            continue;
        }
        curHead.flag = -1;
        curHead.index = i;
        curHead.onclick = function () {
            sortList.call(this, this.index);
        }
    }
})();

//->思考：
//我们现在的DEMO还是有BUG的
//->先点击年龄,年龄按照升序排,在点击武力,此时的年龄乱序,我在点击年龄,年龄本应该还是从新的按照升序排,但是现在是按照降序排列的....

//->思考:
//->利用我们oLis和页面是映射关系的机制，优化升序序排序的切换