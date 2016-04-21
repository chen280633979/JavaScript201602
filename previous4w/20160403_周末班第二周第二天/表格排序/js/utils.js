var utils = (function () {
    return {
        //->listToArray:实现将类数组转换为数组
        listToArray: function (likeAry) {
            if (typeof likeAry === "undefined") {
                throw new Error("参数不合法~~");
            }
            var ary = [];
            try {
                ary = Array.prototype.slice.call(likeAry);
            } catch (e) {
                for (var i = 0, len = likeAry.length; i < len; i++) {
                    ary[ary.length] = likeAry[i];
                }
            }
            return ary;
        },

        //->formatJSON:把JSON格式的字符串转换为JSON格式的对象
        formatJSON: function (jsonStr) {
            //var jsonObj = null;
            //try {
            //    jsonObj = JSON.parse(jsonStr);
            //} catch (e) {
            //    jsonObj = eval("(" + jsonStr + ")");
            //}
            //return jsonObj;
            return "JSON" in window ? JSON.parse(jsonStr) : eval("(" + jsonStr + ")");
        }
    }
})();