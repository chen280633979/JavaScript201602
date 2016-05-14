/*
 * h5场景制作步骤:
 * 1.处理适配的问题(参照background-size:cover原理)
 * 2.给每个li绑定touchstart,touchmove,touchend事件
 * 3.处理上下滑动的效果
 * 4.滑动效果完成后增加css3动画效果
 * */
/*
 background-size:cover的原理
 容器宽(设备宽)/容器高(设备高)<背景图宽(设计稿宽)/背景图高(设计稿高)时 按照高来缩放
 缩放值 = 容器的高/背景图的高
 容器宽(设备宽)/容器高(设备高)>背景图宽(设计稿宽)/背景图高(设计稿高)时 按照宽来缩放
 缩放值 = 容器的宽/背景图的宽*/
var main = document.querySelector("#main");
var oLis = document.querySelectorAll("#main>ul>li");
var winW = document.documentElement.clientWidth;
/*设备的宽*/
var winH = document.documentElement.clientHeight;
/*设备的高*/
var desW = 640;
/*设计稿的宽*/
var desH = 960;
/*设计稿的高*/
if (winW / winH <= desW / desH) {
    main.style.webkitTransform = "scale(" + winH / desH + ")";
} else {
    main.style.webkitTransform = "scale(" + winW / desW + ")";
}

[].forEach.call(oLis, function () {
    var oLi = arguments[0];
    oLi.index = arguments[1];
    oLi.addEventListener("touchstart", start, false);
    oLi.addEventListener("touchmove", move, false);
    oLi.addEventListener("touchend", end, false);
});
//1.记录按下时坐标,移动时坐标,得出移动的距离,根据移动的距离判断出滑动的方向
//2.获得上一个或者下一个的坐标,并且做过界判断
//3.处理上下滑动的距离
function start(e) {
    this.startY = e.changedTouches[0].pageY;
}
function move(e) {
    this.flag = true;//如果是点击不是滑动,不会触发touchmove事件
    e.preventDefault();
    var moveY = e.changedTouches[0].pageY;
    var movePos = moveY - this.startY;
    var index = this.index;
    [].forEach.call(oLis,function(){
        if(arguments[1]!=index){//除了自已,所有的li都隐藏
            arguments[0].style.display = "none";
        }
        arguments[0].className = "";//把所有li的类名清空
        arguments[0].firstElementChild.id = "";//滑动时把li下的第一个子元素的id名清空
    })//除了自己其他的li全部隐藏
    if (movePos > 0) {/*下滑*/
        this.prevsIndex = index == oLis.length - 1 ? 0 : index + 1;
        var duration = -winH + movePos;//winH是自己随便设置的,可以写480都行
    } else if (movePos < 0) {/*上滑*/
        this.prevsIndex = index == 0 ? oLis.length - 1 : index - 1;
        var duration = winH + movePos;
    }
    oLis[this.prevsIndex].style.display  ="block";
    oLis[this.prevsIndex].className = "zIndex";
    oLis[this.prevsIndex].style.webkitTransform = "translate(0," + duration + "px)";
    //处理当前这一张
    //缩放的倍数 = 1- 移动的距离/设备的高度
    oLis[index].style.webkitTransform = "scale("+(1-Math.abs(movePos)/winH*1/2)+") translate(0,"+movePos+"px)";

}
function end(e) {
    if(this.flag){
    //回到原始点的位置
    oLis[this.prevsIndex].style.webkitTransform = "translate(0,0)";
    oLis[this.prevsIndex].style.webkitTransition = "0.7s";
    oLis[this.prevsIndex].addEventListener("webkitTransitionEnd",function(){
        this.style.webkitTransition = "";//相当于清除动画的积累
        this.firstElementChild.id = "a"+this.index;
    });
        this.flag = false;
    }

}








