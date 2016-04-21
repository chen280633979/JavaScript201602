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