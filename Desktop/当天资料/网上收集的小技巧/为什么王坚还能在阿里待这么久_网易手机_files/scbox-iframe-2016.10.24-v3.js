/*
 * netease ADbox apply v1.0
 * Creation date: 2015/8/31
 * Modified date: xxxx/xxxx/xxxxx
*/

//娴眰瀵硅薄
var scBox = new Object();
var s = navigator.userAgent.toLowerCase().match(/msie (\d+)./);
scBox.broswer =  s && s[1] < 7? 'ie6' : 'other';
console.log(scBox.broswer);
if(scBox.broswer)
{
	/***********娴眰骞垮憡鎵ц***********
	*/
	//閰嶇疆淇℃伅
	scBox.width = (typeof(adInfoTempSc.width)=="undefined")?320:adInfoTempSc.width;
	scBox.height = (typeof(adInfoTempSc.height)=="undefined")?300:adInfoTempSc.height;
	scBox.src = (typeof(adInfoTempSc.src)=="undefined")?0:adInfoTempSc.src;
	scBox.url = (typeof(adInfoTempSc.url)=="undefined")?"http://163.com":adInfoTempSc.url;
	scBox.key = (typeof(adInfoTempSc.key)=="undefined")?"sckey":adInfoTempSc.key;
	scBox.time = (typeof(adInfoTempSc.time)=="undefined")?35000:adInfoTempSc.time;
	scBox.adBoxJs = (typeof(adInfoTempSc.adBoxJs)=="undefined")?"http://img2.126.net/ntesrich/auto/adbox/adbox-v1.1.2-120705.js":adInfoTempSc.adBoxJs;
	scBox.position = (typeof(adInfoTempSc.position)=="undefined")?"right":adInfoTempSc.position;
	scBox.cookieTime = 1;
	//鐢熸垚骞垮憡
	scBox.createElement = function()
	{
		//鐢熸垚妗嗘灦
		this.mainDiv = adBox.createDiv(this.width,this.height);
		this.mainDiv.style.zIndex = 9999;
		this.movie = document.createElement("iframe");
		this.movie.style.width = this.width+"px";
		this.movie.style.height = "240px";
		this.movie.style.border = "none";
		this.movie.setAttribute("src",this.src);
		this.movie.setAttribute("scrolling","no");
		//id list
		//scBoxCloseBtn/scBoxMovieFrame/scBoxClickBtn
		this.movieStr = "<div style=\"width:320px; height:300px; background:url(http://img2.126.net/ntesrich/2015/0901/player2.jpg) no-repeat;\"><div id=\"scBoxCloseBtn\" style=\"width:25px; height:25px; background:#F63; float:right; cursor:pointer; filter:alpha(opacity=0); opacity:0;\" onclick=\"scBox.action(1)\"></div><div id=\"scBoxMovieFrame\" style=\"width:320px; height:240px; margin:0; float:left;\"></div><div style=\"height:23px; width:58px; background:url(http://img2.126.net/ntesrich/auto/sc/skin_s_03.jpg) no-repeat; float:right; position:absolute; bottom:5px; right:10px; cursor:pointer;\" id=\"scBoxReplayBtn\"></div></div>";
		this.mainDiv.innerHTML = this.movieStr;
		this.mainDiv.style.display = "none";
		this.movieFrame = document.getElementById("scBoxMovieFrame");
		this.movieFrame.appendChild(this.movie );
	}
	//榧犳爣绉诲叆鏁堟灉
	scBox.replayBtnMouseOverAndOut = function()
	{
		this.replayBtn = document.getElementById("scBoxReplayBtn");
		this.replayBtn.onmouseover = function()
		{
			this.style.	background = "url(http://img2.126.net/ntesrich/auto/sc/skin_s_03-2.jpg)";
		}
		this.replayBtn.onmouseout = function()
		{
			this.style.	background = "url(http://img2.126.net/ntesrich/auto/sc/skin_s_03.jpg)";
		}
		this.replayBtn.onclick = function()
		{	
			scBox.movieFrame.appendChild(scBox.movie);
			clearTimeout(scBox.time35Num);
			scBox.time35Num = setTimeout("scBox.action(1)",scBox.time);
		}
	}
	//璁剧疆浣嶇疆
	scBox.reSetPosition = function()
	{
		if(this.broswer == "ie6")
		{
			//ie6涓嬩富鏂囦欢瀹氫綅
			this.mainDiv.style.position = "absolute";
			if(scBox.position == "right")
			{
				this.mainDiv.style.left = adBox.getClientInfo("width") - this.width - 20 + "px";
			}else if(scBox.position == "left")
			{
				this.mainDiv.style.left = 20 + "px";
			}
			this.mainDiv.style.top = adBox.getClientInfo("top") + adBox.getClientInfo("height") - this.height + "px";
		}else
		{
			//闈瀒e6涓嬩富鏂囦欢瀹氫綅
			this.mainDiv.style.position = "fixed";
			if(scBox.position == "right")
			{
				this.mainDiv.style.left = adBox.getClientInfo("width") - this.width - 20 + "px";
			}else if(scBox.position == "left")
			{
				this.mainDiv.style.left = 20 + "px";
			}
			this.mainDiv.style.top = adBox.getClientInfo("height") - this.height + "px";
		}
		this.reSetPositionNum = setTimeout("scBox.reSetPosition()",1000);
	}
	//浜や簰
	scBox.action = function(code)
	{
		if(code == "first")
		{	
			this.movieFrame.appendChild(this.movie);
			// this.movieFrame.innerHTML = this.movie;
			this.mainDiv.style.display = "block";	
			clearTimeout(this.checkPorssNum);
			this.time35Num = setTimeout("scBox.action(1)",this.time);
			//閲嶆挱鎸夐挳浜嬩欢
			this.replayBtnMouseOverAndOut();
		}else
		{
			this.mainDiv.innerHTML = "";
			this.mainDiv.style.display = "none";
			clearTimeout(this.time35Num);
		}
	}
	//鎵撳紑閾炬帴
	scBox.getURL = function()
	{
		window.open(this.url,"_blank");
	}
	//缁煎悎璋冪敤
	scBox.createAD = function()
	{
		this.cookie = adBox.cookieCount(this.key,15*60);
		if(this.cookie <= this.cookieTime)
		{
			//鐢熸垚鍏冪礌
			this.createElement();
			//璁剧疆浣嶇疆
			this.reSetPosition();
			//1s鍚庢樉绀鸿绐楀箍鍛�
			setTimeout("scBox.action('first')",1000);
		}
	}
	scBox.go = function()
	{
		if(typeof(adBox) == "undefined")
		{
			//瀵煎叆adbox
			document.write("<script language=\"JavaScript\" src=\""+scBox.adBoxJs+"\"></script>");
			this.check = function()
			{
				if(typeof(adBox)=="undefined")
				{
					scBox.checkNum = setTimeout("scBox.check()",1000);
				}else
				{
					clearTimeout(scBox.checkNum);
					scBox.createAD();
				}
			}
			this.check();
		}else
		{
			this.createAD();
		}
	}
	scBox.go();
}