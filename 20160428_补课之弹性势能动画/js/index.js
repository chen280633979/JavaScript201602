var winW = document.documentElement.clientWidth || document.body.clientWidth, winH = document.documentElement.clientHeight || document.body.clientHeight;
var markW = 100, markH = 100;

var markList = document.getElementsByClassName("mark");
for (var i = 0; i < markList.length; i++) {
    on(markList[i], "mousedown", dragDown);
}

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
    window.clearInterval(this.dropTimer);
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
    drop.call(this);
}

//->水平方向的动画
function fly() {
    var _this = this, speed = _this["flySpeed"];
    _this.flyTimer = window.setInterval(function () {
        if (Math.abs(speed) < 0.5) {
            window.clearInterval(_this.flyTimer);
            return;
        }
        speed *= 0.98;
        var curL = _this.offsetLeft + speed;
        var minL = 0, maxL = winW - markW;
        if (curL >= maxL) {
            curL = maxL;
            speed *= -1;
        } else if (curL <= minL) {
            curL = minL;
            speed *= -1;
        }
        _this.style.left = curL + "px";
    }, 10);
}

//->垂直方向的动画
function drop() {
    var _this = this, speed = 9.8;
    _this["dropFlag"] = 0;
    _this.dropTimer = window.setInterval(function () {
        if (_this["dropFlag"] > 1) {//->到达底边不在弹起了
            window.clearInterval(_this.dropTimer);
            return;
        }
        speed += 10;
        speed *= 0.98;
        var curT = _this.offsetTop + speed;
        if (curT >= (winH - markH)) {//->到底
            curT = winH - markH;
            speed *= -1;
            _this["dropFlag"]++;
        } else {
            _this["dropFlag"] = 0;
        }
        _this.style.top = curT + "px";
    }, 10);
}



