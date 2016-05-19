~function (pro) {
    //myTrim:Remove the string and space
    pro.myTrim = function myTrim() {
        return this.replace(/(^ +| +$)/g, "");
    };

    //mySub:Intercept string, this method is distinguished in English
    pro.mySub = function mySub() {
        var len = arguments[0] || 10, isD = arguments[1] || false, str = "", n = 0;
        for (var i = 0; i < this.length; i++) {
            var s = this.charAt(i);
            /[\u4e00-\u9fa5]/.test(s) ? n += 2 : n++;
            if (n > len) {
                isD ? str += "..." : void 0;
                break;
            }
            str += s;
        }
        return str;
    };

    //myFormatTime:Format time
    pro.myFormatTime = function myFormatTime() {
        var reg = /^(\d{4})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?: +)?(\d{1,2})?(?:-|\/|\.|:)?(\d{1,2})?(?:-|\/|\.|:)?(\d{1,2})?$/g, ary = [];
        this.replace(reg, function () {
            ary = ([].slice.call(arguments)).slice(1, 7);
        });
        var format = arguments[0] || "{0}年{1}月{2}日{3}:{4}:{5}";
        return format.replace(/{(\d+)}/g, function () {
            var val = ary[arguments[1]];
            return val.length === 1 ? "0" + val : val;
        });
    };

    //queryURLParameter:Gets the parameters in the URL address bar
    pro.queryURLParameter = function queryURLParameter() {
        var reg = /([^?&=]+)=([^?&=]+)/g, obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return obj;
    };
}(String.prototype);


/*--下载区域的展示和隐藏--*/
$(function () {
    var $downLoad = $(".downLoad"), $downLoadBg = $downLoad.children(".downLoadBg"), $downLoadImg = $downLoad.children(".downLoadImg"), $downLoadLink = $downLoad.children("a");
    $downLoad.on("mouseenter", function () {
        $downLoadBg.stop().slideDown(300);
        $downLoadImg.stop().slideDown(300);
        $downLoadLink.css("borderTopColor", "#1c90f2");
    }).on("mouseleave", function () {
        $downLoadBg.stop().slideUp(300);
        $downLoadImg.stop().slideUp(300);
        $downLoadLink.css("borderTopColor", "transparent");
    });
});

/*--计算中间区域的高度--*/
$(function () {
    auto();
    $(window).on("resize", auto);
    function auto() {
        var winH = document.documentElement.clientHeight || document.body.clientHeight;
        var curH = winH - 76 - 40;
        $("#sectionContent").css("height", curH).attr("curH", curH);
        $(".conLeft").css("height", curH - 2);
        $(".matchList").css("height", curH - 82);
    }
});

/*--让左侧区域实现局部滚动--*/
$(function () {
    var $scrollLeft = new IScroll("#conLeft", {
        mouseWheel: true,
        scrollbars: true,
        bounce: false
    });
});

/*--让右侧区域实现局部滚动--*/
$(function () {
    var $scrollRight = new IScroll("#matchList", {
        mouseWheel: true,
        scrollbars: true,
        bounce: false
    });
    window.$scrollRight = $scrollRight;
});

/*--日期列表区域的相关处理--*/
$(function () {
    var $calendarList = $(".calendarList"), $inner = $calendarList.children(".inner");

    //->事件委托实现数据的绑定
    $(".calendar").on("click", function (e) {
        var tar = e.target, $tar = $(tar), tarTagName = tar.tagName.toUpperCase();
        var $pars = $tar.parents().add($tar);
        if ($pars.hasClass("inner") && /^(A|SPAN)$/i.test(tarTagName)) {
            //->日期列表中的某一个
            tarTagName === "SPAN" ? $tar = $tar.parent() : null;
            scrollToDate($tar.attr("date"));
            $tar.addClass("bg").siblings().removeClass("bg");
            return;
        }

        if ($pars.hasClass("calendarLeft") || $pars.hasClass("calendarRight")) {
            var $call = $.Callbacks();
            var curLeft = parseFloat($inner.css("left")), tarLeft = null;
            if ($pars.hasClass("calendarLeft")) {
                if ($inner.attr("isMove") === "false") {
                    //->左按钮
                    tarLeft = curLeft + 105 * 7;
                    tarLeft >= 0 ? tarLeft = 0 : null;
                    $inner.attr("isMove", "true");
                    $inner.stop().animate({
                        left: tarLeft
                    }, 500, $call.fire);
                }
            }
            if ($pars.hasClass("calendarRight")) {
                if ($inner.attr("isMove") === "false") {
                    //->右按钮
                    tarLeft = curLeft - 105 * 7;
                    var maxLeft = parseFloat($inner.width()) - 105 * 7;
                    Math.abs(tarLeft) >= maxLeft ? tarLeft = -maxLeft : null;
                    $inner.attr("isMove", "true");
                    $inner.stop().animate({
                        left: tarLeft
                    }, 500, $call.fire);
                }
            }

            $call.add(function () {
                var $calenderLink = $inner.children("a");
                $inner.attr("isMove", "false");

                //->重新绑定数据
                var strIndex = Math.abs(parseFloat($inner.css("left"))) / 105, endIndex = strIndex + 6;
                bindData($calenderLink.eq(strIndex).attr("date"), $calenderLink.eq(endIndex).attr("date"));

                //->让第一个有选中的样式
                $calenderLink.eq(strIndex).addClass("bg").siblings().removeClass("bg");
            });
        }
    });


    //->数据请求成功后:绑定数据、开始定位、绑定比赛数据、滚动到具体的区域
    function callBack(jsonData) {
        if (jsonData) {
            var data = jsonData["data"], today = data["today"];
            data = data["data"];

            //->数据绑定
            var str = '';
            if (data) {
                for (var i = 0, len = data.length; i < len; i++) {
                    var curDate = data[i];
                    str += '<a href="javascript:;" date="' + curDate["date"] + '">';
                    str += '<span class="week">' + curDate["weekday"] + '</span>';
                    str += '<span class="date">' + curDate["date"].myFormatTime("{1}-{2}") + '</span>';
                    str += '</a>';
                }
            }
            $inner.html(str).css("width", len * 105);

            //->开始需要把当天的日期选中
            var $calenderLink = $inner.children("a");
            var $curDateLink = $calenderLink.filter("[date='" + today + "']");
            if ($curDateLink.length === 0) {
                //->当天日期没有比赛:找最近一天的
                for (i = 0; i < data.length; i++) {
                    var cur = data[i];
                    if (new Date(cur["date"].replace(/-/g, "/")) - new Date(today.replace(/-/g, "/")) > 0) {
                        today = cur["date"];
                        break;
                    }
                }
                $curDateLink = $calenderLink.filter("[date='" + today + "']");
            }
            $curDateLink.addClass("bg");
            var maxLeft = parseFloat($inner.width()) - 105 * 7;
            if (Math.abs(-$curDateLink.index() * 105 + 315) >= maxLeft) {
                $inner.css("left", -maxLeft);
            } else {
                $inner.css("left", -$curDateLink.index() * 105 + 315);
            }

            //->绑定比赛列表区域的数据
            //当前日期展示区域开始项的索引=当前INNER的LEFT值/105  当前日期展示区域结束项的索引=当前INNER的LEFT值/105+6
            var strIndex = Math.abs(parseFloat($inner.css("left"))) / 105, endIndex = strIndex + 6;
            bindData($calenderLink.eq(strIndex).attr("date"), $calenderLink.eq(endIndex).attr("date"), today);
        }
    }

    //->JSONP请求我们一般都使用异步请求
    var columnId = getMatchNum();
    $.ajax({
        url: "http://matchweb.sports.qq.com/kbs/calendar?columnId=" + columnId + "&_=" + Math.random(),
        type: "get",
        dataType: "jsonp",
        success: callBack
    });
});

function getMatchNum() {
    var url = window.location.href;
    if (url.indexOf("#csl") > -1) {
        return 208;
    }

    if (url.indexOf("#afc") > -1) {
        return 605;
    }

    return 100000;
}

//->根据起始日期和结束的日期,获取到比赛数据,进行数据绑定
function bindData(strDate, endDate, today) {
    function callBack(jsonData) {
        var str = '';
        if (jsonData) {
            var data = jsonData["data"];
            $.each(data, function (key, value) {
                str += '<div class="matchInfo">';
                str += '<h2 date="' + key + '">' + key.myFormatTime("{1}月{2}日") + '</h2>';
                str += '<ul>';
                $.each(value, function (index, item) {
                    str += '<li>';
                    str += '<div class="matchTime"></div>';
                    str += '<div class="matchTeam"></div>';
                    str += '<div class="matchBtn"></div>';
                    str += '</li>';
                });
                str += '</ul>';
                str += '</div>';
            });
        }
        var $matchList = $(".matchList");
        $matchList.children("div").eq(0).html(str);
        $scrollRight.refresh();

        //->让比赛列表区域滚动到当前日期这一项
        if (typeof today !== "undefined") {
            scrollToDate(today);
        } else {
            $scrollRight.scrollTo(0, 0);
        }
    }

    $.ajax({
        url: "http://matchweb.sports.qq.com/kbs/list?columnId=" + getMatchNum() + "&startTime=" + strDate + "&endTime=" + endDate + "&_=" + Math.random(),
        type: "get",
        dataType: "jsonp",
        success: callBack
    });
}

//->滚动到当前日期的位置
function scrollToDate(curDate) {
    $scrollRight.scrollToElement($(".matchList .matchInfo h2[date='" + curDate + "']").get(0), 500);
}


$(function () {
    $(".conLeft a").on("click", function (e) {
        window.location.href = $(this).prop("href");
        location.reload();
        e.preventDefault();
    });
});













