var div=document.getElementById("box");
var Img=div.getElementsByTagName("img");

var jsonDate=null;
!function(){
   var xhr=new XMLHttpRequest();
    xhr.open("get","json/json.txt",false);

    xhr.onreadystatechange=function(){
        if(xhr.readyState===4&&/^2\d+\{2}$/.test(xhr.status)){
            var str=xhr.responseText;

            jsonDate=utils.formatJSON(str);
            console.log(jsonDate)
        }
    };
    xhr.send(null)
}();

!function(){
    var str="";
    for(var i= 0;i<jsonDate.length;i++){
        var curDate=jsonDate[i];
        str+="<li>";
        str+="<div>"+"<img src='' trueSrc='curDate'img']'/>"+"</div>";
        str+="<div>"
        str+="<h2>"+curDate['news']+"</h2>";
        str+="<p>"+curDate['some']+"</p>";
        str+="</div>";
        str+="</li>"
    }
    div.innerHTML=str;
}();

function lazyImg(curEle){
    var oImg=new Image;
    oImg.src=curEle.getAttribute("trueSrc");
    oImg.onload=function(){
        curEle.src=this.src;
        curEle.style.display="block";
        read(curEle)

    };
    curEle.isLoad=true;
}
function read(curEle){
    var target= 1,duration=500,interval=10;
    var step=(target/duration)*10;
    var timer=window.setInterval(function(){
        var imgO=utils.getCss(curEle,"opacity")
        if(imgO>=1){
            imgO.opacity=1;
             window.clearInterval(timer);
            return;
        }
        imgO+=step;
        curEle.style.opacity=imgO;

    },interval)

}
function lazyImgAll(){
    for(var i=0;i<Img.length;i++){
        var nImg=Img[i];
        if(nImg.isLoad){
            continue
        }

        var par=nImg.parentNode;
        var A=par.offsetHeight+utils.offset(par).top,B=util.win("clientHeight")+util.win("scrollTop");
        if(A<B){
            lazyImg(nImg)
        }
}
}
window.setTimeout(lazyImgAll,500);
window.onscroll=lazyImgAll;








