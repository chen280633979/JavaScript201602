(function () {
    var jsonData = utils.formatJSON(jsonStr);
    var tabList = document.getElementById("tabList"), oLis = tabList.getElementsByTagName("li");

    //1、实现我们的数据绑定->"字符串拼接":我们项目中最常用的一种方式,目前听到的模板引擎绑定数据的核心原理都是字符串拼接
    //->优势:把字符都拼接完成后在统一添加到页面,只引发一次回流
    //->弊端:我们每一次都是通过"innerHTML +="来操作的,首先会把页面中原有的标签当做字符串获取到,和最新的字符串进行拼接,最后在重新的放回到页面,浏览器进行重新的渲染...->这样的过程导致了:"原有标签绑定的事件都消失了"
    //~function () {
    //    var str = "";
    //    for (var i = 0, len = jsonData.length; i < len; i++) {
    //        var curData = jsonData[i];
    //        str += "<li>";
    //        for (var key in curData) {
    //            str += "<span>" + curData[key] + "</span>";
    //        }
    //        str += "</li>";
    //    }
    //    tabList.innerHTML += str;
    //}();

    //->动态创建DOM元素的方式
    //优势:我们每一次都是创建一个新的元素,然后增加到容器的末尾,对之前的标签没有产生任何的影响
    //弊端:每创建一个都添加到页面中,引发了多次的DOM回流,相对字符串拼接的方式,比较的耗性能
    //~function () {
    //    for (var i = 0, len = jsonData.length; i < len; i++) {
    //        var curData = jsonData[i];
    //
    //        var oLi = document.createElement("li");
    //        for (var key in curData) {
    //            var oSpan = document.createElement("span");
    //            oSpan.innerHTML = curData[key];
    //            oLi.appendChild(oSpan);
    //        }
    //        tabList.appendChild(oLi);
    //    }
    //}();

    //->DOM性能优化的深入机制:
    //回流:页面中的结构发生改变(增加、删除、元素的位置变了...)浏览器需要把整个页面的HTML机构重新的进行计算 ->非常的消耗性能,JS优化技巧之一,尽量减少DOM的回流
    //重绘:页面中元素的某个样式(背景颜色...)发生改变,浏览器只需要把当前的元素重新的渲染一遍即可

    //->文档碎片:临时创建一个容器,把每一次动态创建的li先存储正在这个容器中,最后在统一的把容器增加到页面中(既不影响原来的,也可以只引发一次回流)
    ~function () {
        var frg = document.createDocumentFragment();
        for (var i = 0, len = jsonData.length; i < len; i++) {
            var curData = jsonData[i];
            //->对于性别数据进行初始化处理:0-男 1-女 2-未知
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


})();



