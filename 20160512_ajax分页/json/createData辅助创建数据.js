var nameAry = ["赵一", "钱二", "孙三", "李四", "周五", "吴六", "郑七", "王八", "冯九", "陈十", "楚一", "魏二", "蒋三", "沈四", "韩五", "杨六"];

function getRandom(n, m) {
    return Math.round(Math.random() * (m - n) + n);
}

var ary = [];
for (var i = 1; i <= 78; i++) {
    var obj = {};
    obj.num = (i >= 1 && i <= 9) ? "00" + i : ((i >= 10 && i <= 99) ? "0" + i : i);
    obj.name = nameAry[getRandom(0, 15)];
    obj.sex = getRandom(0, 1);
    obj.score = getRandom(50, 100);
    ary.push(obj);
}
console.log(JSON.stringify(ary));