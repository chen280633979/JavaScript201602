function ajax(url, callback) {
    var xhr = new XMLHttpRequest;
    url.indexOf("?") > -1 ? url += "&_=" + Math.random() : url += "?_=" + Math.random();
    xhr.open("get", url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
            callback && callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(null);
}

var pageNum = 1, pageCount = 10, total = 0;
var pageList = document.getElementById("pageList"), pageTip = document.getElementById("pageTip"), tipList = pageTip.getElementsByTagName("li"), conList = pageList.getElementsByTagName("li");
var userNum = document.getElementById("userNum");

//->绑定数据
bindHTML(true);
function bindHTML(isFir) {
    //->isFir:true 是否为第一次执行这个方法,第一次执行的话我们需要绑定页码区域,其后不需要重新的绑定了
    ajax("getData?pageCount=" + pageCount + "&pageNum=" + pageNum, function (data) {
        //->解析数据
        isFir ? total = data["total"] : null;
        data = data["data"];

        //->列表区域的数据绑定
        var str1 = "", str2 = "";
        for (var i = 0, len = data.length; i < len; i++) {
            var curData = data[i];
            str1 += "<li num='" + curData["num"] + "'>";
            str1 += "<span>" + curData["num"] + "</span>";
            str1 += "<span>" + curData["name"] + "</span>";
            str1 += "<span>" + (curData["sex"] == 1 ? "女" : "男") + "</span>";
            str1 += "<span>" + curData["score"] + "</span>";
            str1 += "</li>";
        }
        pageList.innerHTML = str1;

        //->给每个LI绑定点击事件跳转到详细页
        for (var k = 0; k < conList.length; k++) {
            conList[k].index = k;
            conList[k].onclick = function () {
                window.location.href = "detail.html?num=" + this.getAttribute("num");
            }
        }

        if (isFir) {
            //->分页区域的数据绑定
            for (i = 1; i <= total; i++) {
                if (i === 1) {
                    str2 += "<li class='bg'>" + i + "</li>";
                    continue;
                }
                str2 += "<li>" + i + "</li>";
            }
            pageTip.innerHTML = str2;
        }
    });

    //->让当前页对应的页码有选中的样式
    for (var i = 0, len = tipList.length; i < len; i++) {
        tipList[i].className = (i + 1) == pageNum ? "bg" : null;
    }

    //->让文本框中的内容跟着变化
    userNum.value = pageNum;
}

//->采用事件委托实现数据切换
document.getElementById("page").onclick = function (e) {
    e = e || window.event;
    var tar = e.target || e.srcElement;

    //->点击的是LI
    if (tar.tagName.toUpperCase() === "LI") {
        if (parseFloat(tar.innerHTML) === pageNum) {
            //->说明当前就是这一页
            return;
        }
        pageNum = parseFloat(tar.innerHTML);
        bindHTML();
        return;
    }

    //->点击的是DIV
    if (tar.tagName.toUpperCase() === "DIV") {
        var inn = tar.innerHTML;
        if (inn === "FIRST") {
            if (pageNum === 1) {
                return;
            }
            pageNum = 1;
        } else if (inn === "LAST") {
            if (pageNum === total) {
                return;
            }
            pageNum = total;
        } else if (inn === "PREV") {
            if (pageNum > 1) {
                pageNum--;
            }
        } else if (inn === "NEXT") {
            if (pageNum < total) {
                pageNum++;
            }
        }
        bindHTML();
    }
};

//->处理文本框
userNum.onkeyup = function (e) {
    e = e || window.event;
    if (e.keyCode === 13) {//->ENTER
        var val = parseFloat(userNum.value);
        if (val === pageNum) {
            return;
        }
        if (val < 1) {
            userNum.value = 1;
            pageNum = 1;
        } else if (val > total) {
            userNum.value = total;
            pageNum = total;
        } else {
            pageNum = val;
        }
        bindHTML();
    }
};




























