//->bind:给当前元素的某一个行为绑定方法
//curEle:当前要操作的元素
//type:要绑定方法的行为类型,例如:"click"、"mouseover"...
//fn:给当前元素对应类型绑定的方法
function bind(curEle, type, fn) {
    if ("addEventListener" in curEle) {
        curEle.addEventListener(type, fn, false);
        return;
    }
    //->IE6~8
    curEle.attachEvent("on" + type, fn);
}

//->unbind:给当前元素的某一个行为移除某一个绑定的方法
function unbind(curEle, type, fn) {
    if ("removeEventListener" in curEle) {
        curEle.removeEventListener(type, fn, false);
        return;
    }
    //->IE6~8
    curEle.detachEvent("on" + type, fn);
}