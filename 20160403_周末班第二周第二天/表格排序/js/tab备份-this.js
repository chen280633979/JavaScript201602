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
        var _this = this;
        _this.flag *= -1;

        var ary = utils.listToArray(oLis);
        ary.sort(function (a, b) {
            //this->window
            var curInn = a.getElementsByTagName("span")[1].innerHTML;
            var nexInn = b.getElementsByTagName("span")[1].innerHTML;
            var curInnNum = parseFloat(curInn), nexInnNum = parseFloat(nexInn);
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
    headList[1].flag = -1;
    headList[1].onclick = function () {
        //this->headList[1]

        //sortList();//->sortList中的this->window
        //->sortList方法执行的时候里面的this变为headList[1]
        //sortList.call(headList[1]);//->sortList中的this->headList[1]
        sortList.call(this);
    };
})();