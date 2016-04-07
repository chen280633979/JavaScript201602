var utils = (function () {
    return {
        /*
         * listToArray:Converts an array of classes to an array
         * @parameter:
         *  likeAry:[object] Class array to convert
         * @return:
         *  [Array] Conversion complete array
         * by team on 2016/03/31
         */
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
        /*
         * formatJSON:Converts a string of JSON format to an object in the JSON format
         * @parameter:
         *  jsonStr:[string] String to convert JSON format
         * @return:
         *  jsonObj:[object] Conversion complete JSON format object
         * by team on 2016/03/31
         */
        formatJSON: function (jsonStr) {
            return "JSON" in window ? JSON.parse(jsonStr) : eval("(" + jsonStr + ")");
        },
        /*
         * getCss:Gets the value of the style property that the current element is calculated by the browser
         * @parameter:
         *   curEle:[object]Elements to be operated at
         *   attr:[string]To get the name of the style
         * @return:
         *   Gets the value of the style attribute
         * by team on 2016/04/06
         */
        getCss: function (curEle, attr) {
            var val = null, reg = null;
            if (window.getComputedStyle) {
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
        /*
         * offset:Gets the offset distance of the current element distance body, including the left offset and top offset
         * @parameter:
         *   curEle:[object]Elements to be operated at
         * @return:
         *   [object]{left:left offset,top:top offset}
         * by team on 2016/04/06
         */
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
        //win:获取或者设置关于浏览器的盒子模型的信息
        win: function (attr, value) {
            //->不传value的话默认是获取样式值
            if (typeof value === "undefined") {
                return document.documentElement[attr] || document.body[attr];
            }
            document.documentElement[attr] = value;
            document.body[attr] = value;
        }
    }
})();