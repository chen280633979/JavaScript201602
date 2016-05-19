var ary = [1, 2, 3, 5, 7, 10, 15, 18, 19];
var num = 8;
for (var i = 0; i < ary.length; i++) {
    if (ary[i] > num) {
        console.log(i, ary[i]);
        break;
    }
}