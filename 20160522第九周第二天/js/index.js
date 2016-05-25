//->把NAV中部分导航默认先隐藏
$(function () {
    var $nav = $(".nav"), $navLink = $nav.find("a"), $navLinkHide = [];
    $navLink.each(function (index, curLink) {
        if (index > 5 && index < 12) {
            $(curLink).css("display", "none");
            $navLinkHide.push(curLink);
        }
    });

    //->独有支持的移动端专属事件:tap、singleTap、doubleTap、longTap、swipe、swipeLeft、swipeRight、swipeUp、swipeDown
    $navLink.eq(5).singleTap(function () {
        var oldHTML = $(this).html();
        if (oldHTML === "展开") {
            $nav.css("height", "11.5rem");
            $(this).html("收起");
            $.each($navLinkHide, function (index, curLink) {
                $(curLink).css("display", "block");
            });
            return;
        }
        $nav.css("height", "8rem");
        $(this).html("展开");
        $.each($navLinkHide, function (index, curLink) {
            $(curLink).css("display", "none");
        });
    });

    //->头部大展开
    $("#navBtn").singleTap(function () {
        var oldH = parseFloat($nav.css("height"));
        if (oldH == 0) {
            $nav.css("height", "8rem");
            return;
        }
        $nav.css("height", "0");
        $navLink.eq(5).html("展开");
        $.each($navLinkHide, function (index, curLink) {
            $(curLink).css("display", "none");
        });
    });
});

//->http://matchweb.sports.qq.com/html/matchDetail?mid=100000:1468517
function callBack(data) {
    console.log(data);
}
$.ajax({
    url: "http://matchweb.sports.qq.com/html/matchDetail?mid=100000:1468517&_=" + Math.random(),
    type: "get",
    dataType: "jsonp",
    success: callBack
});





