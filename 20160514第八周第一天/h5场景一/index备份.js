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
var winW = document.documentElement.clientWidth;/*设备的宽*/
var winH = document.documentElement.clientHeight;/*设备的高*/
var desW = 640;/*设计稿的宽*/
var desH = 960;/*设计稿的高*/
if(winW/winH <= desW/desH){
    main.style.webkitTransform = "scale("+winH/desH+")";
}else{
    main.style.webkitTransform = "scale("+winW/desW+")";
}

[].forEach.call(oLis,function(){
  var oLi = arguments[0];
 oLi.index = arguments[1];
 oLi.addEventListener("touchstart",start,false);
 oLi.addEventListener("touchmove",move,false);
 oLi.addEventListener("touchend",end,false);
});
//1.记录按下时坐标,移动时坐标,得出移动的距离,根据移动的距离判断出滑动的方向
//2.获得上一个或者下一个的坐标,并且做过界判断
//3.处理上下滑动的距离
function start(e){
   this.startY = e.changedTouches[0].pageY;
}
function move(e){
  var moveY = e.changedTouches[0].pageY;
  var movePos = moveY - this.startY;
  var index = this.index;
  if(movePos>0){/*下滑*/
   this.prevsIndex = index == oLis.length - 1 ? 0 : index + 1;
   oLis[this.prevsIndex].className = "zIndex";
   //为了实现下拉的优雅的效果,因此在下滑时上一张先往上移动一半的距离,然后随着往下滑动,上一张往下移动
   //往下滑时,一直算上一张顶端距离设备顶端的距离,如果这个距离变小,会看到上一张往下移动的效果
   var duration = -480+movePos;
   oLis[this.prevsIndex].style.webkitTransform = "translate(0,"+duration+"px)"
  }else if(movePos<0){/*上滑*/
   this.prevsIndex = index == 0 ? oLis.length - 1 : index - 1;
   //下一张先往下移动一半,然后随着往上滑动,下一张往上移动
   //往上滑时,一直在算下一张的顶端距离设备顶端的距离,当距离变小,会看到下一张往上移动的效果
   oLis[this.prevsIndex].className = "zIndex";
   var duration = 480+movePos;
   oLis[this.prevsIndex].style.webkitTransform = "translate(0,"+duration+"px)";

  }

}
function end(e){

}








