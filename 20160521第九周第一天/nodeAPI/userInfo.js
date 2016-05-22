var fs = require("fs");
var FilePath = "./nodeAPI/json/userInfo.json";

//->增加
function add(parData) {
    //->解析传递的参数值
    parData["name"] = parData["name"] || "珠峰培训";
    parData["pass"] = parData["pass"] || "670b14728ad9902aecba32e22fa4f6bd";
    parData["sex"] = parData["sex"] || "0";
    parData["email"] = parData["email"] || "zhufengpeixun@163.com";
    parData["phone"] = parData["phone"] || "4001806960";

    //->获取原有的JSON文件,计算出新增加数据的ID
    var con = fs.readFileSync(FilePath, "utf8");
    con = con === "" ? [] : JSON.parse(con);
    parData["id"] = con.length > 0 ? parseFloat(con[con.length - 1]["id"]) + 1 : 1;

    //->把内容增加到原有数组中,在把最新的重新放回文件
    con.push(parData);
    fs.writeFileSync(FilePath, JSON.stringify(con), "utf8");

    //->编辑返回信息:返回新增加的用户信息
    return {code: 0, message: "添加用户成功!", data: parData};
}

//->验证用户名密码是否正确
function checkLogin(account, pass) {
    var con = fs.readFileSync(FilePath, "utf8");
    con = con === "" ? [] : JSON.parse(con);

    //->循环所有的数据,验证是否存在:账号是用户名或者邮箱或者电话,密码是经过MD5加密的
    var isExist = false;
    for (var i = 0, len = con.length; i < len; i++) {
        var cur = con[i];
        if ((cur["name"] === account || cur["email"] === account || cur["phone"] === account) && cur["pass"] === pass) {
            isExist = true;
            break;
        }
    }

    //->编写返回内容
    var result = null;
    if (isExist) {
        result = {isExist: isExist, message: "账号密码验证成功!", data: cur};
        return result;
    }
    result = {isExist: isExist, message: "账号密码错误!", data: null};
    return result;
}

//->验证邮箱是否存在
function checkEmail(email) {
    var con = fs.readFileSync(FilePath, "utf8");
    con = con === "" ? [] : JSON.parse(con);

    //->循环所有的数据,验证是否存在
    var isExist = false;
    for (var i = 0, len = con.length; i < len; i++) {
        var cur = con[i];
        if (cur["email"] === email) {
            isExist = true;
            break;
        }
    }

    //->编写返回内容
    var result = null;
    if (isExist) {
        result = {isExist: isExist, message: "邮箱已经存在!", data: cur};
        return result;
    }
    result = {isExist: isExist, message: "邮箱不存在!", data: null};
    return result;
}

//->根据ID获取用户的信息
function getInfo(id) {
    var con = fs.readFileSync(FilePath, "utf8");
    con = con === "" ? [] : JSON.parse(con);
    var curUser = null;
    for (var i = 0, len = con.length; i < len; i++) {
        var cur = con[i];
        if (cur["id"] == id) {
            curUser = {
                code: 0,
                message: "获取成功~",
                data: cur
            };
            break;
        }
    }
    if (!curUser) {
        curUser = {
            code: 1,
            message: "用户不存在~"
        };
    }
    return curUser;
}


module.exports = {
    add: add,
    checkLogin: checkLogin,
    checkEmail: checkEmail,
    getInfo: getInfo
};




