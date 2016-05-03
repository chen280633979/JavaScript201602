//->我想在COMPUTED模块中调用SUM模块中的ADD这个方法
var sumModel = require("./sum");//->./的意思是当前目录(最常用的) ../上级目录 ->在当前模块中把SUM模块导入进来,这样的话就可以使用SUM模块中提供的方法了

console.log(sumModel);


sumModel.add(1, 2, 3, 4);
sumModel.remove();

