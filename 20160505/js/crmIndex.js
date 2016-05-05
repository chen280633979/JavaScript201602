var boxList = document.getElementById("boxList"), oLis = boxList.getElementsByTagName("li");

//->实现隔行变色&&鼠标滑过变色的效果
function changeBg() {
    for (var i = 0, len = oLis.length; i < len; i++) {
        var curLi = oLis[i];
        curLi.className = i % 2 === 1 ? "bg" : null;

        curLi.oldClass = curLi.className;
        curLi.onmouseenter = function () {
            this.className = "hov";
        };
        curLi.onmouseleave = function () {
            this.className = this.oldClass;
        };
    }
}

//->实现首页的数据绑定
ajax("/getInfo", function (data) {
    //->data:就是我们通过Ajax获取的数据
    var str = '';
    if (data) {
        for (var i = 0, len = data.length; i < len; i++) {
            var cur = data[i];
            str += '<li>';
            str += '<span class="w60">' + cur["id"] + '</span>';
            str += '<span>' + cur["name"] + '</span>';
            str += '<span class="w60">' + cur["age"] + '</span>';
            str += '<span>' + cur["tel"] + '</span>';
            str += '<span class="w280">' + cur["address"] + '</span>';
            str += '<span class="w100" curId="' + cur["id"] + '">';//->把当前用户的ID存储到自定义属性上,以后点击修改或者删除的时候我们只需要找到这个ID就知道操作的是那一条信息了
            str += '<a href="customerAdd.html?id=' + cur["id"] + '">修改</a>';
            str += '<a href="javascript:;" btnType="delete">删除</a>';
            str += '</span>';
            str += '</li>';
        }
    }
    boxList.innerHTML = str;

    //->我们本次AJAX是异步请求的,所以需要等数据绑定完成后在执行我们的隔行变色
    changeBg();
});

//->实现我们的删除操作:用事件委托处理,如果事件源的自定义属性btnType===delete说明当前点击的是我们的删除按钮
boxList.onclick = function (e) {
    e = e || window.event;
    var tar = e.target || e.srcElement;
    if (tar.getAttribute("btnType") === "delete") {
        var customerID = tar.parentNode.getAttribute("curId");
        var flag = window.confirm("您确定要删除编号为 [ " + customerID + " ] 的这一条信息吗?");
        if (flag) {
            //->确定要删除了
            var parameter = "id=" + customerID;
            parameter = encodeURIComponent(parameter);
            ajax("/deleteInfo?" + parameter, function (data) {
                if (data && data["code"] == 0) {
                    boxList.removeChild(tar.parentNode.parentNode);
                    changeBg();
                }
            });
        }
    }
};





