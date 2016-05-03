//->ADD:在SUM这个模块(这个JS)中有一个任意数求和的方法
function add() {
    var total = null;
    for (var i = 0, len = arguments.length; i < len; i++) {
        var cur = Number(arguments[i]);
        if (!isNaN(cur)) {
            total += cur;
        }
    }
    console.log(total);
}

function remove() {
    console.log("I'M SUM MODEL FUNCTION");
}

//module.exports.add = add;//->在当前模块中把ADD这个方法暴露出来,这样的话以后其他模块只要引入SUM模块,就可以调取ADD方法了,等价于我们JS闭包中的RETURN

module.exports = {
    add: add,
    remove: remove
};


//->下面其实就是实现的原理
//var module={};
//module.exports=(function(){
//    function add() {
//    }
//
//    function remove() {
//
//    }
//    return {
//        add:add,
//        remove:remove
//    }
//})();




