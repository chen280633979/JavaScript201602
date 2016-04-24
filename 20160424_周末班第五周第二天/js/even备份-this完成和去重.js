//->processThis:改变某一个方法中的this关键字
function processThis(callBack, context) {
    var outerArg = Array.prototype.slice.call(arguments, 2);
    return function () {
        var innerArg = Array.prototype.slice.call(arguments, 0);
        callBack.apply(context, outerArg.concat(innerArg));
    }
}

//->bind:给当前元素的某一个行为绑定方法
function bind(curEle, type, fn) {
    if ("addEventListener" in curEle) {
        curEle.addEventListener(type, fn, false);
        return;
    }
    //->IE6~8
    var tempFn = processThis(fn, curEle);
    tempFn.photo = fn;
    if (!curEle["myBind" + type]) {
        curEle["myBind" + type] = [];
    }
    //->解决重复
    var ary = curEle["myBind" + type];
    for (var i = 0; i < ary.length; i++) {
        if (ary[i].photo === fn) {
            return;
        }
    }
    ary.push(tempFn);
    curEle.attachEvent("on" + type, tempFn);
}

//->unbind:给当前元素的某一个行为移除某一个绑定的方法
function unbind(curEle, type, fn) {
    if ("removeEventListener" in curEle) {
        curEle.removeEventListener(type, fn, false);
        return;
    }
    //->IE6~8
    var ary = curEle["myBind" + type];
    if (ary) {
        for (var i = 0; i < ary.length; i++) {
            var tempFn = ary[i];
            if (tempFn.photo === fn) {
                curEle.detachEvent("on" + type, tempFn);
                ary.splice(i, 1);
                break;
            }
        }
    }
}