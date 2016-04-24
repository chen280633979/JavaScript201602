//->processThis:改变某一个方法中的this关键字
//callBack:我要执行的那个方法
//context:我要改变的this
//->Function.prototype.bind方法的实现原理就是这样的
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
    //curEle.attachEvent("on" + type, fn);//->fn执行的时候,里面的THIS是WINDOW，我们想要做的是当fn执行的时候，让里面的THIS变为当前元素
    //->原理:绑定的时候给需要执行的fn方法外面包一层匿名函数,当行为触发的时候,首先执行我们的匿名函数,在匿名函数中在把我们的fn执行,通过call/apply改变fn中的this指向,但是不要忘记还需要给fn传递一个事件对象参数呢

    //curEle.attachEvent("on" + type, processThis(fn, curEle)); //->这样相当于绑定的是一个匿名函数(processThis执行的返回值是一个匿名函数,而我们绑定的也是这个匿名函数),移除的时候不知道移除谁

    if (!curEle["myBind"]) {//->第一次执行bind方法,此时还不存在这个自定义属性呢,我们设置个自定义属性,让其值是一个空数组
        curEle["myBind"] = [];
    }
    //->把fn进行化妆(执行processThis预先处理里面的this指向),把化妆后的结果(一个匿名函数)放在数组中,为了方便后期能够通过化妆前的找到换装后的,我们把化妆前的增加到化妆后的一个私有的属性上
    var tempFn = processThis(fn, curEle);
    tempFn.photo = fn;
    curEle["myBind"].push(tempFn);
    curEle.attachEvent("on" + type, tempFn);
}

//->unbind:给当前元素的某一个行为移除某一个绑定的方法
function unbind(curEle, type, fn) {
    if ("removeEventListener" in curEle) {
        curEle.removeEventListener(type, fn, false);
        return;
    }
    //->IE6~8
    var ary = curEle["myBind"];
    if (ary) {
        for (var i = 0; i < ary.length; i++) {
            var tempFn = ary[i];
            if (tempFn.photo === fn) {
                curEle.detachEvent("on" + type, tempFn);//->在内置的事件池中移除
                ary.splice(i, 1);//->在自己的自定义属性中也把化妆后的tempFn移除掉
                break;
            }
        }
    }
}