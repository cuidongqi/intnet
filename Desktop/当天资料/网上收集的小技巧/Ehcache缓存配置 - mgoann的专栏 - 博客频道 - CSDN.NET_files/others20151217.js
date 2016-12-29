(function() {
	var V = window,
	J = document,
	x = "location",
	rand = Math.floor(Math.random() * 100000),
	urls = [{
		name: "yoyi_u2",//Tanx
		url: "http://cms.tanx.com/t.gif?tanx_nid=29227910&tanx_cm&extendata1=win"
	},
	{
		name: "yoyi_u3",//Baidu
		url: "http://cm.pos.baidu.com/pixel?dspid=6470425"
	},
	{
		name: "yoyi_u4",//Google
		url: "http://cm.g.doubleclick.net/pixel?google_nid=yoyi&google_cm&extra1=win"
	},
	{
		name: "yoyi_u5",//Allyes
		url: "http://cm.qtmojo.com/pixel?allyes_dspid=104&allyes_cm&extra=yy"
	},
	{
		name: "yoyi_u6",//Lingji
		url: "http://cc.xtgreat.com/cm.gif?dspid=11114"
	},
	{
		name: "yoyi_u7",//Youku
		url: "http://cm.miaozhen.atm.youku.com/cm.gif?dspid=11110"
	},
	//{name:"yoyi_u8",url:"http://cmarket.kejet.net/exck?NjY5RTM0OEQxMzQzNkE4"},//Kejet
	{
		name: "yoyi_u9",
		url: "http://mapping.yoyi.com.cn/s/rd?jurl=http%3A%2F%2Fcm.l.qq.com%2F%3Fdspid%3D10008%26dspuid%3D%40%5BYOYICOOKIEID%5D%26gettuid%3D1"
	},
	//Tencent	
	//{name:"yoyi_u10",url:"http://cm.aa.sdo.com/cms.gif?method=CookieMapping&dsp=665387&extendata=snda"},//sdo	
	//{name:"yoyi_u11",url:"http://mapping.yoyi.com.cn/s/rd?jurl=http%3A%2F%2Fo.omgts.cn%2Fadi%2F41%3B98%3B21%3Bpid%3Dyouyi%26uid%3D%40%5BYOYICOOKIEID%5D%3Faip5132"},//omgt
	{
		name: "yoyi_u12",//DiYuanXin
		url: "http://mapping.yoyi.com.cn/s/rd?jurl=http%3A%2F%2Fg.wrating.com%2Fa.gif%3Fa%3D%26c%3D860010-2369010100%26mcookie%3D%40%5BYOYICOOKIEID%5D"
	},
	{
		name: "yoyi_u13",//Acxiom
		url: "http://mapping.yoyi.com.cn/s/rd?jurl=http%3A%2F%2Fp-cn.acxiom-online.com%2Fpixel%2Fsci%3Fpid%3D3027%26uid%3D%40%5BYOYICOOKIEID%5D%26redir%3Dhttp%253A%252F%252Fmapping.yoyi.com.cn%252Fs%252Fmapping%252F%253Ftid%253D%2523COOKIEID%2523%2526ver%253D1%2526extendata%253Dacxiom"
	},
	{
		name: "yoyi_u14",//AK
		url: "http://mapping.yoyi.com.cn/s/rd?jurl=http%3A%2F%2Fd.agkn.com%2Fpixel%2F2598%2F%3Fsp%3D876-2620%26che%3D" + rand + "%26partner_id%3D%40%5BYOYICOOKIEID%5D"
	},
	{
		name: "yoyi_u16",//AdMaster
		url: "http://mapping.yoyi.com.cn/s/rd?jurl=http%3A%2F%2Fcm.admaster.com.cn%2F%3Ftid%3D1137%26type%3D1%26uid%3D%40%5BYOYICOOKIEID%5D%26redir%3Dhttp%253A%252F%252Fmapping.yoyi.com.cn%252Fs%252Fmapping%252F%253Fextendata%253DAdMaster%2526extendata1%253Dwin"
	},
	{
		name: "yoyi_u17",//souhu
		url: "http://t.go.sohu.com/cm.gif?ver=1.0&mid=10039&uid=&ext=win"
	},
	{
		name: "yoyi_u18",//amnet
		url: "http://mapping.yoyi.com.cn/s/rd?jurl=http%3a%2f%2fcm.aac-dmp.cn%2fcm%3fdsp%3dyoyi%26uid%3d%40%5bYOYICOOKIEID%5d"
	},
	{
		name: "yoyi_u19",//huzhong
		url: "http://mapping.yoyi.com.cn/s/rd?jurl=http%3a%2f%2fcm.fastapi.net%2f%3fdspid%3d100032%26dspuid%3d%40%5bYOYICOOKIEID%5d%26gethuid%3d1"
	},
	{   
    	name:"yoyi_u20",//
    	url:"http://mapping.yoyi.com.cn/s/rd?jurl=http%3a%2f%2fidm.bce.baidu.com%2ft%2fping.gif%3fdm%3dbce.baidu.com%2fa1011%26ac%3d%40%5bYOYICOOKIEID%5d%26v%3dbce-1.0%26rnd%3d123456789%26ext_bce_tid%3da1011%26ext_bce_pid%3d%26ext_bce_uid%3d%40%5bYOYICOOKIEID%5d" 	
	},
	{
        name:"yoyi_u21",//Miaozhen
        url:"http://yoyi.cm.cn.miaozhen.com/x.gif?v=yoyi_cm&o=http://mapping.yoyi.com.cn/s/mapping?mzid=__M-MZID__"
	},
	{
        //name:"yoyi_u22",//vivaki
        //url:"http://cm.chinavivaki.com/cm/active?adx=jtkx7qvk"

        name:"yoyi_u22",//vivaki
        url:" http://t1.chinavivaki.com/cm?_t=r&type=imp&hat_id=MTUwJjczJjE5NCY5NDYmMTg5ODQmM34=&l=aHR0cDovL21hcHBpbmcueW95aS5jb20uY24vcy9tYXBwaW5nP2RzcD0xODk4NA=="

	},
	{
        name:"yoyi_u23",//reachmax
        url:"http://m.reachmax.cn/rm.gif?ext=18"
	},
	{
        name:"yoyi_u24",//Fuge
        url:"http://mapping.yoyi.com.cn/s/rd?jurl=http%3a%2f%2fits.fugetech.com%2fbg.gif%3fp%3d2385%26k%3dF36EDD89C209A701%26g%3d%40%5bYOYICOOKIEID%5d"
	}
	// {
 //        name:"yoyi_u25",//autohome
 //        url:"http://cm.adx.autohome.com.cn/cm?dspid=1&ahuid=xxx"
	// }
	],
	
	Ps = function(a) {
		d = new Image(1, 1);
		d.src = a;
		d.onload = function() {
			d.onload = null;
		}
	},
	__H = function(name, value, expires, domain) {
		var expires = new Date();
		expires.setTime(expires.getTime() + 7 * 24 * 3600 * 1000); //7 days
		document.cookie = name + "=" + escape(value) + ((expires) ? ";expires=" + expires.toGMTString() : "") + ((domain) ? ";domain=" + domain: "");
	},
	__I = function(name) {
		var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
		if (arr != null) return unescape(arr[2]);
		return null;
	}; (function() {
		if ("http:" == J[x].protocol) {
			for (var ui = 0; ui < urls.length; ui++) {
				if (__I(urls[ui].name) == null) {
					Ps(urls[ui].url);
					__H(urls[ui].name, "true");
				}
			}
		}
	})();
})();// JavaScript Document