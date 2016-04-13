var utils=(function(){
    return {
        //类数租转换为数组
        listToArray:function(likeArray){
            var ary=[];
            try{
                ary=Array.prototype.slice.call(likeArray,0)
            }catch(e){
                for(var i= 0,len=likeArray.length;i<len;i++){
                    ary[ary.length]=likeArray[i];
                }
            }
            return ary;
        },

        //json格式的字符串转换为Json格式的对象

        formatJSON:function(jsonStr){
            return "JSON" in window?JSON.parse(jsonStr):eval("("+jsonStr+")")
        },

        //获取元素在页面中的css样式
        getCss:function(curEle,attr){
            var val=null,reg=null;
            if(window.getComputedStyle){
                val=window.getComputedStyle(curEle,null)[attr];
            }else{
                if(attr==="opacity"){
                    val=curEle.currentStyle[attr];
                    reg=/^alpha\(opacity=(\d+(?:\.\d+)?)\)/;
                    val=reg.exec(val)?reg.exec(val)[1]/100:1;
                }else{
                    val=curEle.currentStyle[attr];
                }
            }
            reg=/^(-?\d+(\.\d+)?)(px|pt|em|rem)?$/;
            return val=reg.test(val)?parseFloat(val):val;
        },

        //获取元素偏离body的距离
        offset:function(curEle){
            var disLeft=curEle.offsetLeft,disTop=curEle.offsetTop,par=curEle.offsetParent;
            while(par){
                if(navigator.userAgent.indexOf("MSIE 8")===-1){
                    disLeft+=par.clientLeft;
                    disTop+=par.clientTop
                }
                disLeft+=par.offsetLeft;
                disTop+=par.offsetTop;
                par=par.offsetParent
            }
            return{left:disLeft,top:disTop};
        },

        //获取盒子模型信息
        win:function(attr,value){
            if(typeof value==="undefined"){
                return document.documentElement[attr]||document.body[attr];
            }
            document.documentElement[attr]=[value];
            document.body[attr]=[value];
        }
    }
})();
