//->基于内置类的原型扩展一个等价于BIND的方法,预先把某一个函数中的THIS进行处理,把一些参数值预先传递进来(事件对象也可以获取到)
Function.prototype.myBind = function myBind(context) {
    var _this = this;
    var outerArg = Array.prototype.slice.call(arguments, 1);
    return function () {
        var innerArg = Array.prototype.slice.call(arguments, 0);
        _this.apply(context, outerArg.concat(innerArg));
    }
};

//->给元素的某一个行为绑定方法:解决IE6~8下的THIS和重复问题
function bind(curEle, type, fn) {
    if (curEle.addEventListener) {
        curEle.addEventListener(type, fn, false);
        return;
    }
    var tempFn = fn.myBind(curEle);
    tempFn.photo = fn;

    !curEle["myBind" + type] ? curEle["myBind" + type] = [] : null;
    var ary = curEle["myBind" + type];
    for (var i = 0; i < ary.length; i++) {
        if (ary[i].photo === fn) {
            return;
        }
    }
    ary.push(tempFn);
    curEle.attachEvent("on" + type, tempFn);
}
function unbind(curEle, type, fn) {
    if (curEle.removeEventListener) {
        curEle.removeEventListener(type, fn, false);
        return;
    }
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

//->自己模拟内置的事件池创建一个临时的容器,把所有需要绑定的方法先放在自己的容器中,然后只给当前元素的某个行为绑定一个方法RUN(把这个方法需要增加到内置的事件池中),当行为触发的时候执行RUN方法,在RUN执行的过程中,我们在把通过ON绑定的那些方法依次的按顺序执行即可
function on(curEle, type, fn) {
    !curEle["myEvent" + type] ? curEle["myEvent" + type] = [] : null;
    var ary = curEle["myEvent" + type];
    for (var i = 0; i < ary.length; i++) {
        if (ary[i] === fn) {
            return;
        }
    }
    ary.push(fn);
    bind(curEle, type, run);
}

function off(curEle, type, fn) {
    var ary = curEle["myEvent" + type];
    if (ary) {
        for (var i = 0; i < ary.length; i++) {
            var curFn = ary[i];
            if (curFn === fn) {
                ary[i] = null;
                break;
            }
        }
    }
}

function run(e) {
    if (window.event) {
        e.target = e.srcElement;
        e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
        e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
        e.preventDefault = function () {
            e.returnValue = false;
        };
        e.stopPropagation = function () {
            e.cancelBubble = true;
        };
    }
    var ary = this["myEvent" + e.type];
    if (ary) {
        for (var i = 0; i < ary.length; i++) {
            var curFn = ary[i];
            if (typeof curFn === "function") {
                curFn.call(this, e);
                continue;
            }
            ary.splice(i, 1);
            i--;
        }
    }
}







