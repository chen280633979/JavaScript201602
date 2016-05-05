var fs = require("fs");
function init(query, res) {
    var data = fs.readFileSync("./json/customerInfo.json", "utf8");
    data = JSON.parse(data);

    //->在原来的文件中找到和当前要删除用户ID相同的那一项
    var obj = {};
    for (var i = 0; i < data.length; i++) {
        var cur = data[i];
        if (cur.id == query.id) {
            data.splice(i, 1);
            obj = cur;
            break;
        }
    }

    //->在把最新的DATA重新放入文件中
    fs.writeFileSync("./json/customerInfo.json", JSON.stringify(data));

    //->给客户端响应信息
    res.writeHead(200, {'content-type': 'application/json; charset=UTF-8'});
    res.end(JSON.stringify({code: 0, desc: "删除成功!", data: obj}));
}
module.exports = {
    init: init
};