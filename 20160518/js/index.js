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
        //->计算整个中间的区域
        var winH = document.documentElement.clientHeight || document.body.clientHeight;
        var curH = winH - 76 - 40;
        $("#sectionContent").css("height", curH).attr("curH", curH);

        //->左侧的区域需要在整个区域高度的基础上-2px(上下边框),设置完成后需要把局部滚动的设置刷新一下才可以有效果
        $(".conLeft").css("height", curH - 2);
        $scrollLeft.refresh();

        //->右侧比赛列表区域的高度也需要设置
        $(".matchList").css("height", curH - 82);
        $scrollRight.refresh();
    }
});

/*--让左侧区域实现局部滚动--*/
var $scrollLeft = new IScroll("#conLeft", {
    mouseWheel: true,
    scrollbars: true,
    bounce: false
    //mouseWheel: true,//->是否支持鼠标滚轮滚动
    //scrollbars: true//->是否显示滚动条
    //useTransform: true,
    //useTransition: false,//->设置使用css3动画来实现滚动
    //momentum: false,//->在用户快速触摸屏幕时,你可以开/关势能动画,关闭此功能将大幅度提升性能
    //tap: false,//->是否允许用户在点击里面的内容
    //bounce: false
    //bounceEasing: 'elastic',
    //bounceTime: 1200//->到边界后是否有缓冲的动画
});

/*--让右侧区域实现局部滚动--*/
var $scrollRight = new IScroll("#matchList", {
    mouseWheel: true,
    scrollbars: true,
    bounce: false
});





