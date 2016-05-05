var fs = require("fs");
function init(query, res) {
    var data = fs.readFileSync("./json/customerInfo.json", "utf8");
    data = JSON.parse(data);

    //->在原来的文件中找到和当前要查询用户ID相同的那一项
    var obj = {};
    for (var i = 0; i < data.length; i++) {
        var cur = data[i];
        if (cur.id == query.id) {
            obj = cur;
            break;
        }
    }

    //->给客户端响应信息
    res.writeHead(200, {'content-type': 'application/json; charset=UTF-8'});
    res.end(JSON.stringify(obj));
}
module.exports = {
    init: init
};