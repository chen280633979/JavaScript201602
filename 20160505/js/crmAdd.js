String.prototype.myTrim = function myTrim() {
    return this.replace(/^ +| +$/g, "");
};
var userSubmit = document.getElementById("userSubmit");
var userName = document.getElementById("userName"), userAge = document.getElementById("userAge"), userPhone = document.getElementById("userPhone"), userAddress = document.getElementById("userAddress");

//->首先获取当前页面URL地址栏后面的参数值 ->根据传递的参数当前页面是修改还是增加
var obj = queryURLParameter(window.location.href);
var flag = "id" in obj ? "update" : "add";

//->如果是修改的话,我们需要把原来的数据获取出来,放到对应的文本框中
if (flag === "update") {
    ajax("/detailInfo?" + encodeURIComponent("id=" + obj.id), function (data) {
        userName.value = data["name"];
        userAge.value = data["age"];
        userPhone.value = data["tel"];
        userAddress.value = data["address"];
    });
}

userSubmit.onclick = function () {
    var parameter = "name=" + userName.value.myTrim() + "&age=" + userAge.value.myTrim() + "&tel=" + userPhone.value.myTrim() + "&address=" + userAddress.value.myTrim();
    if (flag === "update") {
        parameter += "&id=" + obj.id;
    }
    parameter = encodeURIComponent(parameter);
    
    //->增加:把页面中的每一个文本框中的内容都获取到,调取Ajax传递给服务器,实现增加功能
    if (flag === "add") {
        ajax("/addInfo?" + parameter, function (data) {
            if (data && data["code"] == 0) {
                window.location.href = "index.html";//->实现页面的跳转
                return;
            }
            alert("信息创建失败~");
        });
        return;
    }

    //->当前的操作是修改
    ajax("/updateInfo?" + parameter, function (data) {
        if (data && data["code"] == 0) {
            window.location.href = "index.html";
            return;
        }
        alert("信息修改失败~");
    });
};


