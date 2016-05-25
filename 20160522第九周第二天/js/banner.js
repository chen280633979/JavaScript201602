//->这样传递参数可以保证在函数中的$都是Zepto(防止多库都是采用$操作导致的冲突)
~function ($) {
    //->由于我们的轮播图需要先保证有数据,才能进行以下的操作,所以我们采取同步请求
    var bannerData = null;
    $.ajax({
        url: "/bannerInfo?_=" + Math.random(),
        type: "get",
        dataType: "json",
        async: false,
        success: function (data) {
            bannerData = data;
        }
    });

    var count = bannerData.length, step = 1, autoTimer = null, interval = 2000, lastTimer = null, delayTimer = null;
    var winW = document.documentElement.clientWidth || document.body.clientWidth;
    var $banner = $(".banner"), $inner = $banner.children(".inner"), $tip = $banner.children(".tip");

    //->数据绑定
    ~function () {
        var str1 = '', str2 = '';
        if (bannerData) {
            str1 += '<div><img src="" alt="" trueImg="' + bannerData[count - 1]["url"] + '"/></div>';
            $.each(bannerData, function (index, curData) {
                str1 += '<div><img src="" alt="" trueImg="' + curData["url"] + '"/></div>';
                str2 += '<li></li>';
            });
            str1 += '<div><img src="" alt="" trueImg="' + bannerData[0]["url"] + '"/></div>';
        }

        //->重新计算INNER区域的宽度
        $inner.html(str1).css("width", (count + 2) * winW).children("div").css("width", winW);
        $tip.html(str2);
    }();

    var $imgList = $inner.find("img"), $tipList = $tip.children("li");

    //->图片延迟加载
    window.setTimeout(loadImg, 500);
    function loadImg() {
        $imgList.each(function (index, curImg) {
            //this->curImg
            var oImg = new Image;
            oImg.src = $(curImg).attr("trueImg");
            oImg.onload = function () {
                //this->oImg
                $(curImg).attr("src", this.src).css("display", "block").animate({opacity: 1}, 300);
                oImg = null;
            }
        });
    }

    //->焦点切换
    changeTip();
    function changeTip() {
        var tempStep = step;
        step > count ? tempStep = 1 : null;
        step < 1 ? tempStep = count : null;
        $tipList.each(function (index, curTip) {
            (index + 1) === tempStep ? $(curTip).addClass("bg") : $(curTip).removeClass("bg");
        });
    }

    //->自动运动
    autoTimer = window.setInterval(autoMove, interval);
    function autoMove() {
        $inner[0].style.webkitTransitionDuration = "0.5s";
        step++;
        $inner.css("left", -winW * step);
        changeTip();
        if (step > count) {
            lastTimer = window.setTimeout(function () {
                $inner[0].style.webkitTransitionDuration = "0s";
                step = 1;
                $inner.css("left", -winW * step);
                window.clearTimeout(lastTimer);
            }, 500);
        }
    }

    //->实现滑动过程中的切换
    //在我们实现页面中某一个元素的滑动的时候需要把当前整个页面TOUCHMOVE的默认行为阻止掉,否则会出现很多的问题
    $(document).on("touchmove", function (e) {
        e.preventDefault();
    });

    init();
    function init() {
        $.each(["start", "move", "end"], function (index, item) {
            $inner.on("touch" + item, eval(item));
        });
    }

    function uninit() {
        $.each(["start", "move", "end"], function (index, item) {
            $inner.off("touch" + item, eval(item));
        });
    }


    function start(e) {
        window.clearInterval(autoTimer);//->按下的第一件事情就是清除自动轮播
        window.clearTimeout(delayTimer);

        //->记录起始的位置
        var point = e.touches[0];
        $(this).attr({
            strX: point.clientX,//->起始手指X坐标
            strY: point.clientY,//->起始手指Y坐标
            endX: "",
            endY: "",
            strL: parseFloat($inner.css("left")),//->起始INNER的LEFT
            isFlag: "false",//->是否发生滑动
            dir: "",//->滑动的方向
            changeX: ""//->横向偏移的值
        });
    }

    function move(e) {
        $inner[0].style.webkitTransitionDuration = "0s";

        var point = e.touches[0];
        $(this).attr({
            endX: point.clientX,//->当前手指X坐标
            endY: point.clientY//->当前手指Y坐标
        });
        var isFlag = isSwipe($(this).attr("strX"), $(this).attr("strY"), $(this).attr("endX"), $(this).attr("endY"));
        $(this).attr("isFlag", isFlag);

        //->如果已经发生滑动了,继续做当前盒子的移动
        if (isFlag) {
            var dir = swipeDir($(this).attr("strX"), $(this).attr("strY"), $(this).attr("endX"), $(this).attr("endY"));
            $(this).attr("dir", dir);

            //->只有向左右滑才会进行操作
            var strL = parseFloat($(this).attr("strL"));
            var changeX = $(this).attr("endX") - $(this).attr("strX");
            $(this).attr("changeX", changeX);

            if (dir === "Left" || dir === "Right") {
                $inner.css("left", strL + changeX);
            }
        }
    }

    function end(e) {
        $inner[0].style.webkitTransitionDuration = "0.5s";

        var isFlag = $(this).attr("isFlag"), dir = $(this).attr("dir"), changeX = $(this).attr("changeX");
        if (isFlag === "true" && /^(Left|Right)$/i.test(dir)) {
            uninit();

            //->滑动的距离不足1/4回归到原来的位置
            if (Math.abs(changeX) < winW / 4) {
                $inner.css("left", -step * winW);
            }

            //->滑动的距离大于1/4向左或者向右左走一张
            if (Math.abs(changeX) >= winW / 4) {
                dir === "Left" ? step++ : null;
                dir === "Right" ? step-- : null;
                $inner.css("left", -step * winW);
                changeTip();
            }

            //->滑动的边界判断
            lastTimer = window.setTimeout(function () {
                if (dir === "Left") {
                    if (step > count) {
                        $inner[0].style.webkitTransitionDuration = "0s";
                        step = 1;
                        $inner.css("left", -winW * step);
                    }
                }

                if (dir === "Right") {
                    if (step < 1) {
                        $inner[0].style.webkitTransitionDuration = "0s";
                        step = 5;
                        $inner.css("left", -winW * step);
                    }
                }

                init();
                window.clearTimeout(lastTimer);
            }, 500);
        }

        delayTimer = window.setTimeout(function () {
            window.clearInterval(autoTimer);
            autoTimer = window.setInterval(autoMove, interval);
            window.clearTimeout(delayTimer);
        }, interval);

        var _this = this;
        $.each(["strX", "strY", "endX", "endY", "strL", "isFlag", "dir", "changeX"], function (index, item) {
            $(_this).attr(item, null);
        });
    }

    //->检测是否发生了滑动
    function isSwipe(strX, strY, endX, endY) {
        return Math.abs(endX - strX) >= 30 || Math.abs(endY - strY) >= 30;
    }

    //->检测滑动的方向
    function swipeDir(strX, strY, endX, endY) {
        return Math.abs(endX - strX) >= Math.abs(endY - strY) ? ((endX - strX) > 0 ? "Right" : "Left") : ((endY - strY) >= 0 ? "Down" : "Up");
    }
}(Zepto);

