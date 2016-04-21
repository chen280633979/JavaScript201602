function listToArray(likeAry) {
    try {
        return [].slice.call(likeAry, 0);
    } catch (e) {
        var ary = [];
        for (var i = 0; i < likeAry.length; i++) {
            ary.push(likeAry[i]);
        }
        return ary;
    }
}
