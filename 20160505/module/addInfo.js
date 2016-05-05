var fs = require("fs");
function init(query, res) {
    //->query中存储了客户端触动给服务器端的信息内容{name:'',age:'',tel:'',address:''}
    //->创建我要增加的内容的结构
    var obj = {};
    for (var key in query) {
        if (query.hasOwnProperty(key)) {
            obj[key] = query[key];
        }
    }

    //->首先把之前的内容获取到
    var data = fs.readFileSync("./json/customerInfo.json", "utf8");
    data = JSON.parse(data);

    //->给要增加的结构内容中创建ID:原来记录最后一条信息的ID加上1就是当前我们需要的ID
    if (data.length === 0) {
        obj.id = 1;
    } else {
        obj.id = parseInt(data[data.length - 1].id) + 1;
    }

    //->把我需要增加的内容obj存放到data中
    data.push(obj);

    //->把最新的DATA转换为一个字符串重新的添加到JSON文件中
    fs.writeFileSync("./json/customerInfo.json", JSON.stringify(data));

    //->给客户端响应一条记录:告诉它我已经增加成功了
    res.writeHead(200, {'content-type': 'application/json; charset=UTF-8'});
    res.end(JSON.stringify({code: 0, desc: "添加成功!", data: obj}));
}
module.exports = {
    init: init
};