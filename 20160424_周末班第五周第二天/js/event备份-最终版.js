//->processThis:改变某一个方法中的this关键字
function processThis(callBack, context) {
    var outerArg = Array.prototype.slice.call(arguments, 2);
    return function () {
        var innerArg = Array.prototype.slice.call(arguments, 0);
        callBack.apply(context, outerArg.concat(innerArg));
    }
}

//->bind:给当前元素的某一个行为绑定方法->THIS、重复两个问题解决了
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

//->on:自己创建一个事件池,我们把需要给当前元素绑定的方法都存放在自己的事件池中
function on(curEle, type, fn) {
    if (!curEle["myEvent" + type]) {
        curEle["myEvent" + type] = [];
    }
    var ary = curEle["myEvent" + type];
    //->如果自己的事件池中已经存储了这个方法,我们就不需要在往进存储了
    for (var i = 0; i < ary.length; i++) {
        if (ary[i] === fn) {
            return;
        }
    }
    ary.push(fn);

    //->每一次执行我们的on方法,都把fire这个方法绑定到内置的事件池中(我们可以使用上述已经完成的bind来做这个操作,因为它已经把THIS、重复、事件对象等都处理好了)
    bind(curEle, "click", fire);
}

//->off:在自己创建的事件池中移除对应的方法
function off(curEle, type, fn) {
    var ary = curEle["myEvent" + type];
    if (ary) {
        for (var i = 0; i < ary.length; i++) {
            if (ary[i] === fn) {
                //ary.splice(i, 1); //->这样每一次移除都会把自定义事件池中方法对应的索引进行修改,在执行fire的时候,索引会乱->"数组塌陷问题"
                ary[i] = null;
                return;
            }
        }
    }
}

//->fire:把其绑定在内置的事件池中,只绑定一次(内置事件池中当前行为只有这一个方法),当fire执行的时候,把curEle["myEvent" + type]中存储的所有的方法依次的按照顺序执行
function fire(e) {
    //->统一把e处理兼容了,以后在方法中的e就不需要在处理兼容了
    if (window.event) {
        //IE6~8
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

    //this->curEle
    var ary = this["myEvent" + e.type];
    if (ary) {
        for (var i = 0; i < ary.length; i++) {
            var curFn = ary[i];
            //curFn();//this->window 我应该让每一个方法中的this都变为当前元素this(curEle),并且还需要把事件对象传递给对应的方法
            if (typeof curFn === "function") {
                curFn.call(this, e);
            } else {
                //->应该是我们在off方法移除后,把这一项的值赋值为null,此时我们把为null的这一项移除掉
                ary.splice(i, 1);
                i--;
            }
        }
    }
}