var mark = document.getElementById("mark");
var winW = document.documentElement.clientWidth || document.body.clientWidth, winH = document.documentElement.clientHeight || document.body.clientHeight;
var markW = mark.offsetWidth, markH = mark.offsetHeight;

on(mark, "mousedown", dragDown);
function dragDown(e) {
    this["strX"] = e.clientX;
    this["strY"] = e.clientY;
    this["strL"] = this.offsetLeft;
    this["strT"] = this.offsetTop;
    if (this.setCapture) {
        this.setCapture();
        on(this, "mousemove", dragMove);
        on(this, "mouseup", dragUp);
        return;
    }
    this["MOVE"] = dragMove.myBind(this);
    this["UP"] = dragUp.myBind(this);
    on(document, "mousemove", this["MOVE"]);
    on(document, "mouseup", this["UP"]);

    //->清除正在运行的动画
    window.clearInterval(this.flyTimer);
}

function dragMove(e) {
    var curL = e.clientX - this["strX"] + this["strL"];
    var curT = e.clientY - this["strY"] + this["strT"];
    var minL = 0, maxL = winW - markW, minT = 0, maxT = winH - markH;
    curL = curL <= minL ? minL : (curL >= maxL ? maxL : curL);
    curT = curT <= minT ? minT : (curT >= maxT ? maxT : curT);
    this.style.left = curL + "px";
    this.style.top = curT + "px";

    //->计算水平方向运动的速度
    //浏览器中每一个事件行为都有一个最短的反应时间minTime,在minTime以内,不会重复触发这个行为,只有超过了这个最短时间才会在触发下一次的行为
    //我们水平方向运动的速度取决于拖拽结束的那一瞬间鼠标距离上次距离的偏移,偏移的距离大速度就快,偏移的距离短,速度慢
    if (!this["flyPre"]) {
        this["flyPre"] = this.offsetLeft;
    } else {
        this["flySpeed"] = this.offsetLeft - this["flyPre"];
        this["flyPre"] = this.offsetLeft;
    }
}

function dragUp(e) {
    if (this.releaseCapture) {
        this.releaseCapture();
        off(this, "mousemove", dragMove);
        off(this, "mouseup", dragUp);
        return;
    }
    off(document, "mousemove", this["MOVE"]);
    off(document, "mouseup", this["UP"]);

    //->拖拽结束执行动画
    fly.call(this);
}

//->水平方向的动画
function fly() {
    //this->mark
    var _this = this, speed = _this["flySpeed"];
    _this.flyTimer = window.setInterval(function () {
        //->由于我们的offsetLeft每一次获取的值都会出现四舍五入,这样如果本次增加一个小于0.5的速度值的话,下一次获取的值还是上次的值,加的速度起不到作用了,我们结束动画即可
        if (Math.abs(speed) < 0.5) {
            window.clearInterval(_this.flyTimer);
            return;
        }

        speed *= 0.98;//->每一次都让速度乘以一个小一的值,这样我们的速度就在衰减
        var curL = _this.offsetLeft + speed;
        var minL = 0, maxL = winW - markW;
        if (curL >= maxL) {//->到达右边界
            curL = maxL;
            speed *= -1;
        } else if (curL <= minL) {//->到达左边界
            curL = minL;
            speed *= -1;
        }
        _this.style.left = curL + "px";
    }, 10);
}



