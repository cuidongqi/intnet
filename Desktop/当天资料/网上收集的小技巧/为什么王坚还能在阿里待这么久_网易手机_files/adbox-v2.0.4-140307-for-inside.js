/*
 * netease ADbox base v2.0.0
 * Creation date: 2012/5/17
*/

/************[adBox属性行为一览]************
 * adBox.getClientInfo (param) param:
                                 height:    返回页面可见高
				                 width:     返回页面可见宽
				                 top:       返回页面被卷走的高度
				                 root:      返回浏览器内核类型
 * adBox.createSwf  (id,width,height,src,fvs)
				                  id:       swf id
				 				  width:    swf高度
								  height:   swf文件高度
								  src:      swf文件地址
								  fvs:		flashvars参数
 * adBox.createDiv (width,height)
								  width:    div 宽度
								  height:    div高度
 * adBox.getElementPosition(e) 
								e:				模块对象（id）
 * adBox.swfLoadPross(name) 返回flash对象加载进度
 * adBox.cookieCount(key,time) 
								key:			所代表的cookie数量
								time:			秒
 * adBox.createFrameList(id,w,h,c,i,a,l,t)
								id:				div id
								w:				width
								h:				height
								c:				color		"none"代表无此属性
								i:				images src
								a:				alpha		"none"代表无此属性
								l:				left
								t:				top
								cu:			cursor
 *adBox.creatFrame = function(w,h,id1,id2,id3,cw,ch,imgSrc)
								w:				宽
								h:				高
								id1:			id1
								id2:			id2
								id3:			id3-id3为空则没有关闭按钮
								cw:			关闭按钮宽
								ch:			关闭按钮高
								imgSrc:		关闭按钮绝对地址
 * adBox.setPosition = function(obj,w,h,shui,chui,sNum,cNum)
								obj			定位对象
								w				对象宽
								h				对象高
								shui			水平距离 l/c/r
								chui			垂直距离t/c/b
								sNum		水平微调
								cNum		垂直微调
*********************结束*******************/


/**************[adBox:配置]***************
 **
 * 对象名：adBox
 */
//公共对象声明
var adBox = new Object();
/*****************结束*********************/


/**********[adbox:客户端分辨率信息]********
 */
//获取浏览器信息
adBox.getClientInfo = function(param)
{
	if(param == "height")
	{
		return (document.body.clientHeight>document.documentElement.clientHeight)&&(document.documentElement.clientHeight!=0)?document.documentElement.clientHeight:document.body.clientHeight;
	}else if(param == "width")
	{
		return (document.documentElement.clientWidth>document.body.clientWidth)&&(document.documentElement.clientWidth!=0)?document.documentElement.clientWidth:document.body.clientWidth;
	}else if(param == "top")
	{
		return document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop;
	}else if(param == "root")
	{
		var Sys = {};
		var ua = navigator.userAgent.toLowerCase();
		var s;
		(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
		(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
		(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
		(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
		(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
		if(Sys.ie){	
			if(parseInt(Sys.ie)==6){return "ie6";}
			else if(parseInt(Sys.ie)==7){return "ie7";}
			else if(parseInt(Sys.ie)==8){return "ie8";}
			else if(parseInt(Sys.ie)==9){return "ie9";}
			else if(parseInt(Sys.ie)==10){return "ie10";}
			else {return 0;}
		}
		else if(Sys.firefox){return "ff";}
		else if(Sys.chrome){return "chr";}
		//else if(Sys.safari){return "safari";}
		//else if(Sys.opera){return "opera";}
		else{return 0;}
	}
}
/*****************结束********************/


/*************[adbox:元素操作]*************/
//生成swf
adBox.createSwf = function (id,width,height,src,fvs)
{
	var swf="<object id=\""+id+"\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\""+width+"\" height=\""+height+"\">";
	swf+="<param name=\"movie\" value=\""+src+"\" />";
	swf+="<param name=\"wmode\" value=\"transparent\" />";
	swf+="<param name=\"quality\" value=\"high\" />";
	swf+="<param name=\"allowScriptAccess\" value=\"always\" />";
	swf+="<param name=\"FlashVars\" value=\"code="+fvs+"\" />"
	swf+="<embed wmode=\"transparent\" src=\"" + src + "\" quality=\"high\" width=\"" + width + "\" height=\"" + height + "\" type=\"application/x-shockwave-flash\" allowScriptAccess=\"always\" name=\"" + id + "\" FlashVars=\"code="+fvs+"\"></embed>";
	swf+="</object>";
	return swf;
}
//生成并返回div
adBox.createDiv = function (width,height)
{
	var divObj = document.createElement("div");
	divObj.style.width = width+"px";
	divObj.style.height = height+"px";
	divObj.style.zIndex = 999;
	divObj.style.overflow = "hidden";
	//divObj.style.background="#fff";
	document.body.appendChild(divObj);
	return divObj;
}
//生成frame
adBox.creatFrame = function(w,h,id1,id2,id3,cw,ch,imgSrc)
{
	obj= 
	{
		//默认素材frame
		d1:id1,w1:w,h1:h,c1:"none",i1:"",a1:"none",l1:0,t1:0,cu1:"auto",
		//默认点击层
		d2:id2,w2:w,h2:h,c2:"#fff",i2:"",a2:0,l2:0,t2:-1*h,cu2:"pointer",
		//默认关闭按钮
		d3:id3,w3:cw,h3:ch,c3:"#fff",i3:imgSrc,a3:100,l3:w-cw,t3:-2*h,cu3:"pointer"
	}
	var frameStr = "";
	frameStr += adBox.createFrameList(obj.d1,obj.w1,obj.h1,obj.c1,obj.i1,obj.a1,obj.l1,obj.t1,obj.cu1);
	frameStr += adBox.createFrameList(obj.d2,obj.w2,obj.h2,obj.c2,obj.i2,obj.a2,obj.l2,obj.t2,obj.cu2);
	if(id3 != "")frameStr += adBox.createFrameList(obj.d3,obj.w3,obj.h3,obj.c3,obj.i3,obj.a3,obj.l3,obj.t3,obj.cu3);
	return frameStr;
}
//生成frame List
adBox.createFrameList = function(id,w,h,c,i,a,l,t,cu)
{
	c = (c == "none")?"":"background:"+c+";";
	a = (a == "none")?"":"filter:alpha(opacity="+a+"); opacity:"+(a*0.01)+";";
	var frameStr = "<div id="+id+" style=\"width:"+w+"px; height:"+h+"px; "+c+" background-image:url("+i+"); "+a+" position:relative; left:"+l+"px; top:"+t+"px; cursor:"+cu+"; background-repeat:no-repeat; font-size:0; \"></div>";
	return frameStr;
}
//返回元素绝对位置
adBox.getElementPosition = function(e)   
{  
    var t = e.offsetTop;  
    var l = e.offsetLeft;  
    while(e = e.offsetParent)  
    {  
        t += e.offsetTop;  
    	l += e.offsetLeft;  
    }  
    return {left:l,top:t};  
}  
//定位对象
adBox.setPosition = function(obj,w,h,shui,chui,sNum,cNum)
{
	sNum = Number(sNum);
	cNum = Number(cNum);
	if(adBox.getClientInfo("root") == "ie6")
	{
		obj.style.position = "absolute";
		//水平距离
		if(shui == "l") obj.style.left = sNum + "px";
		else if(shui == "c") obj.style.left = sNum + adBox.getClientInfo("width")/2 - w/2 + "px";
		else if(shui == "r") obj.style.left = sNum + adBox.getClientInfo("width") - w + "px";
		//垂直距离
		if(chui == "t") obj.style.top = cNum + adBox.getClientInfo("top") + "px";
		else if(chui == "c") obj.style.top = cNum + adBox.getClientInfo("top") + adBox.getClientInfo("height")/2 - h/2 + "px";
		else if(chui == "b") obj.style.top = cNum + adBox.getClientInfo("top") + adBox.getClientInfo("height") - h + "px";
	}else
	{
		obj.style.position = "fixed";
		//水平距离
		if(shui == "l") obj.style.left = sNum + "px";
		else if(shui == "c") obj.style.left = sNum + adBox.getClientInfo("width")/2 - w/2 + "px";
		else if(shui == "r") obj.style.left = sNum + adBox.getClientInfo("width") - w + "px";
		//垂直距离
		if(chui == "t") obj.style.top = cNum + "px";
		else if(chui == "c") obj.style.top = cNum + adBox.getClientInfo("height")/2 - h/2 + "px";
		else if(chui == "b") obj.style.top = cNum + adBox.getClientInfo("height") - h + "px";
	}
}
//返回swf加载进度
adBox.swfLoadPross = function(list)
{
	var leight = list.leight;
	var pross = 100;
	for(var i =0; i<leight; i++)
	{
		pross *= window[list[i]].PercentLoaded()*0.01;
	}
	return pross;
}
//打开新链接
adBox.getUrl = function(link)
{
	window.open(link,"_target");
}
/*****************结束*******************/


/*******[adbox:cookie相关操作]************/
//计算cookie key数量
adBox.cookieCount = function(key,time)
{
	var today = new Date();
	var executeYear=today.getYear();
	var executeMonth=today.getMonth()+1;
	var executeDay=today.getDate();
	var executeDate=executeYear+""+executeMonth+""+executeDay;
	var date=executeDate;
	var channel="channel";
	var cookiesid="neteaseAD"+date+channel+"cookies"+key;
	var count = this.getCookie2(cookiesid);
	var expDays = 1;
	var exp = new Date();
	//判断过期时间
	if(typeof(time) == "undefined")
	{
		exp.setTime(exp.getTime() + (expDays*24*60*60*1000));
	}else
	{
		exp.setTime(exp.getTime() + (expDays*time*1000));
	}
	
	if(count == null) 
	{
		this.setCookie2(cookiesid,'2',exp);
		count = 1;
	}else
	{
		var newcount = parseInt(count) + 1;
		if(newcount<2) count=1;
		this.setCookie2(cookiesid,newcount,exp);
	}
	return count;
}
//获取cookie
adBox.getCookie2 = function(name) 
{ 
	var arg = name + "="; 
	var alen = arg.length;
	var clen = document.cookie.length;
	var i = 0; 
	while (i < clen) 
	{ 
		var j   = i + alen; 
		if (document.cookie.substring(i, j) == arg)
		{
			return this.getCookieVal2 (j);
		}
		i = document.cookie.indexOf(" ", i) + 1;
		if (i == 0)
		{
			break;
		}
	}
	return null;
}
//辅助获取cookie
adBox.getCookieVal2 = function(offset) 
{
	var endstr = document.cookie.indexOf (";", offset);
	if (endstr == -1)
	{
		endstr = document.cookie.length;
	}
	return unescape(document.cookie.substring(offset, endstr));
}
//设置cookie
adBox.setCookie2 = function(name,value) 
{ 
	var argv = this.setCookie2.arguments;
	var argc = this.setCookie2.arguments.length;
	var expires = (argc > 2) ? argv[2] : null; 
	var path = (argc > 3) ? argv[3] : null; 
	var domain = (argc > 4) ? argv[4] : null; 
	var secure = (argc > 5) ? argv[5] : false; 
	document.cookie = name + "=" + escape (value) + 
	((expires == null) ? "" : ("; expires=" + expires.toGMTString())) + 
	((path == null) ? ("; path=/") : ("; path=" + path)) + 
	((domain == null) ? ("; domain=.163.com") : ("; domain=" + domain)) + 
	//((path == null) ? "" : ("; path=" + path)) + 
	//((domain == null) ? "" : ("; domain=" + domain)) + 
	((secure == true) ? "; secure" : "");
}
/***************************结束****************************/