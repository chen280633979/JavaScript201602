var utils = (function () {
    return {

        listToArray: function (likeAry) {
            var ary = [];
            try {
                ary = Array.prototype.slice.call(likeAry, 0);
            } catch (e) {
                for (var i = 0; i < likeAry.length; i++) {
                    ary[ary.length] = likeAry[i];
                }
            }
            return ary;
        },
        formatJSON: function (jsonStr) {
            return "JSON" in window ? JSON.parse(jsonStr) : eval("(" + jsonStr + ")");
        },

        offset: function (curEle) {
            var disLeft = curEle.offsetLeft, disTop = curEle.offsetTop, par = curEle.offsetParent;
            while (par) {
                if (navigator.userAgent.indexOf("MSIE 8") === -1) {
                    disLeft += par.clientLeft;
                    disTop += par.clientTop;
                }
                disLeft += par.offsetLeft;
                disTop += par.offsetTop;
                par = par.offsetParent;
            }
            return {left: disLeft, top: disTop};
        },

        win: function (attr, value) {
            if (typeof value === "undefined") {
                return document.documentElement[attr] || document.body[attr];
            }
            document.documentElement[attr] = value;
            document.body[attr] = value;
        },

        getCss: function (curEle, attr) {
            var val = null, reg = null;
            if (flag) {
                val = window.getComputedStyle(curEle, null)[attr];
            } else {
                if (attr === "opacity") {
                    val = curEle.currentStyle["filter"];
                    reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                    val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
                } else {
                    val = curEle.currentStyle[attr];
                }
            }
            reg = /^(-?\d+(\.\d+)?)(px|pt|em|rem)?$/;
            return reg.test(val) ? parseFloat(val) : val;
        },
    }
})();