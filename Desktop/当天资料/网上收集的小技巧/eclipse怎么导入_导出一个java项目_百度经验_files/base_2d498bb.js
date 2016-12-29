define("common-jquery:widget/js/ui/base/base.js",function(e,t,n){function i(e){var t=o.isFunction(e)?e:function(){this.type="base"},n=function(e){s.create(this),this.guid=++o.guid,t.apply(this,arguments),"object"==typeof e&&this._init(e),this.init(e)};return n.extend=function(e){return o.extend(n.prototype,e),n},n.extend({_init:function(e){try{var t=this;o.each(e,function(e,n){o.isFunction(n)?t.on(e,n):t[e]=n})}catch(n){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:n.message,path:"common-jquery:widget/js/ui/base/base.js",method:"",ln:29})}},init:function(){try{}catch(e){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:e.message,path:"common-jquery:widget/js/ui/base/base.js",method:"",ln:30})}},render:function(){},dispose:function(){},getElements:function(){}})}var o=e("common-jquery:widget/lib/jquery/jquery.js"),s=e("common-jquery:widget/js/util/event/event.js");n.exports=i});
;define("common-jquery:widget/js/logic/login/login.js",function(o,n,e){var i=o("common-jquery:widget/lib/jquery/jquery.js"),t=o("common-jquery:widget/js/util/event/event.js"),s=o("common-jquery:widget/js/ui/dialog/dialog.js"),c=null,r=!1,u="http://passport.bdimg.com/passApi/js/uni_login_wrapper.js?cdnversion="+(new Date).getTime(),a="/common/isLogin",g={patch:"",isLogin:function(){window.location.reload(!0)},notLogin:function(){t.fire("login.log",{patch:g.patch,onLoginSuccess:g.isLogin})},submitErr:function(){}},l={registerLink:"https://passport.baidu.com/v2/?reg&tpl=exp&u="+encodeURIComponent(top.location.href),onLoginSuccess:g.isLogin,onLoginFailure:g.notLogin,onSubmitedErr:g.submitErr,cache:!0,tangram:!0,apiOpt:{product:"exp",u:window.top.location.href,staticPage:"http://jingyan.baidu.com/static/common/html/v3Jump.html"},authsite:["tsina","renren","tqq","fetion"],authsiteCfg:{tpl:"exp",display:"popup",u:window.top.location.href,jumpUrl:"http://jingyan.baidu.com/static/common/html/xd.html",onBindSuccess:function(){return l.onLoginSuccess(),!1},onBindFailure:function(){return l.onSubmitedErr(),!1}},onshow:function(){}};t.on("login.check",function(o,n){i.extend(g,n),i.post(a,{_t:(new Date).getTime()},function(o){return 0==o.errno?(o.userType>0?t.fire("login.setUsername",{onSetSuccess:g.isLogin,from:"check"}):t.fire("login._setUsernameSuccess"),!0):(g.notLogin(),!1)})}),t.on("login.log",function(o,n){n=n||{},n.onLoginSuccess||(n.onLoginSuccess=function(){window.location.reload(!0)}),g.isLogin=n.onLoginSuccess,l.onLoginSuccess=function(o){t.fire("dialog.close"),t.fire("login._success"),o.returnValue=!1},r?c&&c.show():(i.ajax({dataType:"script",crossDomain:!0,url:u,success:function(){c=passport.pop.init(l),c.show(),i.extend(e.exports,c)}}),r=!0)}),t.on("login._success",function(){t.fire("login.setUsername",{onSetSuccess:g.isLogin})}),t.on("login.setUsername",function(o,n){var e=function(){var o=s.iframe({content:"/z/exp-common/fillname.html?t="+(new Date).getTime(),title:"填写用户名",width:560,height:250,autoDispose:!0,close:function(){window.Geditorframe&&window.Geditorframe.onDialogClose(),o.close()}})};n.onSetSuccess||(n.onSetSuccess=function(){window.location.reload(!0)}),g.isLogin=n.onSetSuccess,n.from&&"check"==n.from?e():i.post(a,{_t:(new Date).getTime()},function(o){return 0==o.errno?(o.userType>0?e():t.fire("login._setUsernameSuccess"),!0):void 0},"json")}),t.on("login._setUsernameSuccess",function(){void 0!=g.userFormerLoginStatus?g.isLogin(g.userFormerLoginStatus):g.isLogin()}),t.on("login._bindWeibosuccess",function(o,n){var e="微博";n&&n.fromWeibo&&(e=n.fromWeibo),alert("您已经成功绑定"+e+"。若您的经验文章被分享到新浪微博，将会@您。感谢您的热心参与！"),location.reload()}),t.on("dialog.close",function(){c&&c.hide&&c.hide()})});
;define("common-jquery:widget/userbar/userbar.js",function(e,t,n){var o=e("common-jquery:widget/lib/jquery/jquery.js"),r=e("common-jquery:widget/js/util/event/event.js");e("common-jquery:widget/js/logic/login/login.js");var a={init:function(){try{var e=this;if(e.updateMsg(),1==F.context("user").isLogin){var t=o("#userbar-logout");t&&(location.href.indexOf("/user/nuc")>-1||location.href.indexOf("/user/npublic")>-1?t.attr("href","http://passport.baidu.com/?logout&aid=7&u=http://jingyan.baidu.com"):t.attr("href","http://passport.baidu.com/?logout&aid=7&u="+encodeURIComponent(location.href)))}else{o("#userbar-login").click(function(e){try{e.preventDefault(),r.fire("login.check")}catch(e){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:e.message,path:"common-jquery:widget/userbar/userbar.js",method:"",ln:36})}});var n=o("#top-reg-link");if(n){var a=n.attr("href");n.attr("href",a+encodeURIComponent(location.href))}}}catch(i){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:i.message,path:"common-jquery:widget/userbar/userbar.js",method:"",ln:46})}},updateMsg:function(){var e="http://msg.baidu.com/ms?ct=18&cm=3&tn=bmSelfUsrStat&mpn=13227114&un="+F.context("user").name+"&t="+(new Date).getTime();o.ajax({type:"get",async:!1,url:e,dataType:"jsonp",success:function(){t()},error:function(){t()}});var t=function(){redmsg&&msgnum>0&&o("#mnum").html(msgnum)}}};n.exports=a});
;define("common-jquery:widget/js/logic/msg/income-share/income-share.js",function(require,exports,module){var Dialog=(require("common-jquery:widget/lib/jquery/jquery.js"),require("common-jquery:widget/js/ui/dialog/dialog.js")),IncomeShare={init:function(data,type){try{{var money=+data.amount+"+",msgId=data.messageid,content=['<div class="sun"></div>','<p class="money">恭喜你本月成功提现<span>'+money+"</span>元现金稿酬！",'<div class="share-container">','<div class="bdsharebuttonbox" data-tag="share_1">','<a class="bds_weixin" data-cmd="weixin"></a>','<a class="bds_tsina" data-cmd="tsina"></a>','<a class="bds_qzone" data-cmd="qzone" href="#"></a>','<a class="bds_tqq" data-cmd="tqq"></a>',"</div>",'<p class="desc">成功分享至站外还有额外的福利分成哦！<a href="" target="_blank">详情>></a></p>',"</div>"].join("");Dialog.alert(content,{title:"提现成功",width:500,height:405,className:"income-share-dialog",open:function(){var Msg=require("common-jquery:widget/js/logic/msg/msg.js");with(Msg.readMessage(type,{mid:msgId}),window._bd_share_config={common:{bdUrl:"http://jingyan.baidu.com/user/income",bdSnsKey:{},bdText:"写经验，有钱赚！我刚刚在百度经验提现了"+money+"元现金！赶快来看看吧！",bdMini:"2",bdMiniList:!1,bdPic:"",bdStyle:"0",bdSize:"32"},share:{}},document)0[(getElementsByTagName("head")[0]||body).appendChild(createElement("script")).src="http://bdimg.share.baidu.com/static/api/js/share.js?v=86835285.js?cdnversion="+~(-new Date/36e5)]}})}}catch(e){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:e.message,path:"common-jquery:widget/js/logic/msg/income-share/income-share.js",method:"",ln:59})}}};module.exports=IncomeShare});
;define("common-jquery:widget/js/logic/msg/dubangbang/dubangbang.js",function(e,a,i){var s=e("common-jquery:widget/lib/jquery/jquery.js"),o=e("common-jquery:widget/js/ui/dialog/dialog.js"),n={map:function(e){var a=e.level||1,i="",s=["您已闯过此关，获得<em>"+e.new_gift+"</em>","恭喜您又闯过一关！<br/>奖品由<em>"+e.old_gift+"</em>升级为<em>"+e.new_gift+"</em>",["恭喜您赢得了","<em>"+e.new_gift+"</em>","<br/>","并额外获得","<span>"+e.cash+"元</span>","现金红包"].join("")];switch(+a){case 1:case 2:i=s[0],i+="<br/>英雄，请受我一拜！~";break;case 3:i=s[2],i+="<br/>继续挑战更高关卡吧～";break;case 4:case 5:case 6:case 7:case 8:i=s[1],i+="<br/>英雄，请受我一拜！~"}return i},init:function(a){try{var i=this;i.options=a;var n=['<div class="wrapper">',"<header>","<h1>闯关成功！</h1>",'<div class="i-smile"></div>','<div class="cur-pointer close-dialog close-x"></div>',"</header>",'<div class="content">',"<p>"+i.map(i.options.other)+"</p>",'<div class="cur-pointer close-dialog close-btn">继续挑战</div>',"</div>","</div>"].join(""),c=o.alert(n,{width:393,height:247,className:"dialog-dubangbang",open:function(){s(".close-dialog").click(function(){try{c.close()}catch(e){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:e.message,path:"common-jquery:widget/js/logic/msg/dubangbang/dubangbang.js",method:"",ln:74})}})},close:function(){var a=e("common-jquery:widget/js/logic/msg/msg.js");a.readMessage(21,{mid:i.options.messageid})}})}catch(g){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:g.message,path:"common-jquery:widget/js/logic/msg/dubangbang/dubangbang.js",method:"",ln:85})}}};i.exports=n});
;define("common-jquery:widget/js/logic/msg/go-and-see/go-and-see.js",function(e,o,s){var i=e("common-jquery:widget/lib/jquery/jquery.js"),a=e("common-jquery:widget/js/ui/dialog/dialog.js"),c={map:function(e){var o=e.level||1,s="",i=["您已闯过此关，获得<em>"+e.new_gift+"</em>","<br/>奖品由<em>"+e.old_gift+"</em>升级为<em>"+e.new_gift+"</em>不愧是经验旅行家~",["恭喜您赢得了","<em>"+e.new_gift+"</em>"].join("")];switch(+o){case 1:s+="<br/>您已解锁中国 <br />获得<em>"+e.new_gift+"</em>，继续环游世界吧~";break;case 2:s+="<br/>您已解锁日本 <br />获得<em>"+e.new_gift+"</em>，继续环游世界吧~";break;case 3:s+="<br/>您已解锁埃及，获得<em>"+e.new_gift+"</em>，继续环游世界吧~";break;case 4:s="<br/>您已解锁荷兰",s+=i[1];break;case 5:s="<br/>您已解锁法国",s+=i[1];break;case 6:s="<br/>您已解锁澳大利亚",s+=i[1];break;case 7:s="<br/>您已解锁意大利",s+=i[1];break;case 8:s="<br/>您已解锁美国",s+=i[1]}return s},init:function(o){try{var s=this;s.options=o;var c="继续挑战";s.options.other.level<=3&&(c="不必多礼");var n=['<div class="wrapper">',"<header>",'<h1><span class="dialog-go-title-deco"></span>经验走着瞧</h1>','<div class="i-smile"></div>','<div class="cur-pointer close-dialog close-x go-close"></div>',"</header>",'<div class="content">',"<p>"+s.map(s.options.other)+"</p>",'<div class="cur-pointer close-dialog close-btn">'+c+"</div>","</div>","</div>"].join(""),t=a.alert(n,{width:393,height:247,className:"dialog-go",open:function(){i(".close-dialog").click(function(){try{t.close()}catch(e){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:e.message,path:"common-jquery:widget/js/logic/msg/go-and-see/go-and-see.js",method:"",ln:89})}})},close:function(){var o=e("common-jquery:widget/js/logic/msg/msg.js");o.readMessage(37,{mid:s.options.messageid})}})}catch(r){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:r.message,path:"common-jquery:widget/js/logic/msg/go-and-see/go-and-see.js",method:"",ln:100})}}};s.exports=c});
;define("common-jquery:widget/js/logic/msg/douniwan/douniwan.js",function(o,n,e){var i=o("common-jquery:widget/lib/jquery/jquery.js"),a=o("common-jquery:widget/js/ui/dialog/dialog.js"),d={init:function(n){try{var e=this;e.options=n;var d="";void 0!==F.context("user").uname&&(d=F.context("user").uname);var t,s=['<div class="dialog-douniwan wrapper-portrait">',"</div>"].join(""),u=['<div class="dialog-douniwan wrapper-pendant">',"</div>"].join(""),g=o("common-jquery:widget/js/logic/msg/msg.js");e.options.other.douplay_badge?t=u:e.options.other.douplay_pendant&&(t=s);var c=a.alert(t,{width:640,height:300,className:"dialog-douniwan",open:function(){i(".dialog-douniwan").on("click",".dialog-douniwan",function(o){try{o.preventDefault(),c.close(),window.open("/user/nuc"),g.readMessage(36,{mid:e.options.messageid})}catch(o){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:o.message,path:"common-jquery:widget/js/logic/msg/douniwan/douniwan.js",method:"",ln:55})}})}})}catch(r){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:r.message,path:"common-jquery:widget/js/logic/msg/douniwan/douniwan.js",method:"",ln:58})}}};e.exports=d});
;define("common-jquery:widget/js/logic/msg/school2016/school2016.js",function(require,exports,module){var $=require("common-jquery:widget/lib/jquery/jquery.js"),bt=require("common-jquery:widget/js/util/template/template.js"),Dialog=require("common-jquery:widget/js/ui/dialog/dialog.js"),tpl=[function(_template_object){var _template_fun_array=[],fn=function(__data__){var _template_varName="";for(var name in __data__)_template_varName+="var "+name+'=__data__["'+name+'"];';eval(_template_varName),_template_fun_array.push('<div class="content">    <a class="close-dialog">关闭</a>    <p class="p1">',"undefined"==typeof uname?"":baidu.template._encodeHTML(uname),'，恭喜你</p>    <p class="p2">成功入学',"undefined"==typeof school?"":baidu.template._encodeHTML(school),'并获得了奖励~</p>    <a class="go-school" href="/activity/newterm" target="_blank">经验开学季</a>        '),"经验大学校园"!==school&&_template_fun_array.push('        <p class="p3">想获得更大奖励嘛？继续参加入学考试吧~</p>    '),_template_fun_array.push("</div>"),_template_varName=null}(_template_object);return fn=null,_template_fun_array.join("")}][0];School2016={init:function(e){try{e.other.uname=F.context("user").uname;var o=Dialog.alert(tpl(e.other),{width:634,height:346,className:"dialog-school2016",open:function(){$(".close-dialog").click(function(){try{o.close()}catch(e){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:e.message,path:"common-jquery:widget/js/logic/msg/school2016/school2016.js",method:"",ln:22})}}),$(".go-school").on("click",function(){try{o.close()}catch(e){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:e.message,path:"common-jquery:widget/js/logic/msg/school2016/school2016.js",method:"",ln:25})}})},close:function(){var o=require("common-jquery:widget/js/logic/msg/msg.js");o.readMessage(40,{mid:e.messageid})}})}catch(a){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:a.message,path:"common-jquery:widget/js/logic/msg/school2016/school2016.js",method:"",ln:36})}}},module.exports=School2016});
;define("common-jquery:widget/js/logic/msg/badge/badge.js",function(require,exports,module){var $=require("common-jquery:widget/lib/jquery/jquery.js"),bt=require("common-jquery:widget/js/util/template/template.js"),Dialog=require("common-jquery:widget/js/ui/dialog/dialog.js"),tpl=[function(_template_object){var _template_fun_array=[],fn=function(__data__){var _template_varName="";for(var name in __data__)_template_varName+="var "+name+'=__data__["'+name+'"];';eval(_template_varName),_template_fun_array.push('<div class="mask" style="position: fixed;width: 100%;height: 100%;background-color: #000;opacity: 0.6;top: 0;left: 0;z-index: 9999999;"></div>'),1==type&&_template_fun_array.push(' <div class="dialog-redbox redbox-wealth-dialog" style="z-index: 99999999">    <div class="content">        <h1>恭喜你！',"undefined"==typeof uname?"":baidu.template._encodeHTML(uname),'</h1>        <p style="margin-bottom: 10px">成功发布了一篇3星原创经验</p>        <p style="margin-top: 10px">并获得一个活动红包～</p>    </div>    <div class="prize-type">        <p style="margin-top: 8px;">人民币</p>        <p>',"undefined"==typeof value?"":baidu.template._encodeHTML(value),'</p>     </div>    <div class="btn"></div>    <div class="go-to-activity"></div>    <div class="close"></div></div>'),_template_fun_array.push(""),2==type&&_template_fun_array.push('<div class="dialog-redbox redbox-wealth-dialog" style="z-index: 99999999">    <div class="content">        <h1>恭喜你！',"undefined"==typeof uname?"":baidu.template._encodeHTML(uname),'</h1>        <p style="margin-bottom: 10px">成功发布了一篇3星原创经验</p>        <p style="margin-top: 10px">并获得财富值～</p>    </div>    <div class="prize-type">        <p style="margin-top: 8px;">财富值</p>        <p>',"undefined"==typeof value?"":baidu.template._encodeHTML(value),'</p>     </div>    <div class="btn"></div>    <div class="go-to-activity"></div>    <div class="close"></div></div>'),_template_fun_array.push(""),3==type&&_template_fun_array.push('<div class="badge-dialog dialog-redbox" style="z-index: 99999999">    <div class="content">        <h1>恭喜你！',"undefined"==typeof uname?"":baidu.template._encodeHTML(uname),"</h1>        <p>获得“","undefined"==typeof value?"":baidu.template._encodeHTML(value),'”徽章一枚，集齐所有徽章获得龙猫移动电源一个～</p>        <p>继续加油吧～</p>    </div>    <div class="btn"></div>    <div class="go-to-activity"></div>    <div class="close"></div></div>'),_template_fun_array.push(""),4==type&&_template_fun_array.push('<div class="dialog-redbox prize-redbox-dialog" style="z-index: 99999999">    <div class="content">        <h1>太棒了！',"undefined"==typeof uname?"":baidu.template._encodeHTML(uname),'</h1>        <p>真为你高兴，你集齐所有的徽章，获得了龙猫移动电源～</p>        <p>奖品不限量，多劳多得哦～</p>    </div>    <div class="btn"></div>    <div class="go-to-activity"></div>    <div class="close"></div></div>'),_template_fun_array.push(""),_template_varName=null}(_template_object);return fn=null,_template_fun_array.join("")}][0];Badge={init:function(e){try{var t=function(){var e=document.location.toString(),t=e.split("//"),a=t[1].indexOf("/"),i=t[1].substring(a);return-1!=i.indexOf("?")&&(i=i.split("?")[0]),i},a=t();if("/activity/red2016"!==a&&"/user/nuc"!==a)return;var i=e.other;$("body").append(tpl(i)),$(document).bind("scroll",function(e){e.preventDefault(),e.stopPropagation(),$("body").css("overflow-y","hidden")}),$(".close").on("click",function(e){try{$.ajax({url:"/submit/notice?method=userReadSystemNotice&maintype=50",type:"post",success:function(e){0===e.errno&&($(".mask").hide(),$(".dialog-redbox").hide(),$("body").css("overflow-y","auto"))}})}catch(e){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:e.message,path:"common-jquery:widget/js/logic/msg/badge/badge.js",method:"",ln:50})}}),$(".go-to-activity").on("click",function(e){try{$.ajax({url:"/submit/notice?method=userReadSystemNotice&maintype=50",type:"post",async:!1,success:function(e){0===e.errno&&window.open("/activity/red2016","_target")}})}catch(e){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:e.message,path:"common-jquery:widget/js/logic/msg/badge/badge.js",method:"",ln:63})}}),$(".btn").on("click",function(e){try{$.ajax({url:"/submit/notice?method=userReadSystemNotice&maintype=50",type:"post",async:!1,success:function(e){0===e.errno&&(window.open("/activity/red2016","_self"),window.open("/edit/content"))}})}catch(e){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:e.message,path:"common-jquery:widget/js/logic/msg/badge/badge.js",method:"",ln:77})}})}catch(o){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:o.message,path:"common-jquery:widget/js/logic/msg/badge/badge.js",method:"",ln:82})}}},module.exports=Badge});
;define("common-jquery:widget/js/logic/msg/msg.js",function(e,i,t){var o=e("common-jquery:widget/lib/jquery/jquery.js"),s=e("common-jquery:widget/js/ui/dialog/dialog.js"),n=e("common-jquery:widget/js/ui/tip/tip.js"),a=e("common-jquery:widget/lib/cookie/cookie.js");e("common-jquery:widget/lib/jquery.plugins/browser.js");var c=e("common-jquery:widget/js/logic/msg/income-share/income-share.js"),r=e("common-jquery:widget/js/logic/msg/dubangbang/dubangbang.js"),m=e("common-jquery:widget/js/logic/msg/go-and-see/go-and-see.js"),g=e("common-jquery:widget/js/logic/msg/amazing-2016/amazing-2016.js"),u=e("common-jquery:widget/js/logic/msg/douniwan/douniwan.js"),l=e("common-jquery:widget/js/logic/msg/school2016/school2016.js"),d=e("common-jquery:widget/js/logic/msg/badge/badge.js"),p={readMessage:function(e,i,t){var s={method:"userReadSystemNotice",maintype:e},n=o.extend(s,i||{});o.post("/submit/notice",n,function(){o.isFunction(t)&&t.apply(this,arguments)})},show:function(e,i){var t=this,s=e.length;if(i){var c=['<div class="msg-brief">',"<p>你有<b>"+i+"</b>条未读消息</p>",'<div class="close-msg"></div>',"</div>",'<div class="msg-detail">',e.join(""),"</div>"].join("");t.LEFT_OFFSET=16,t.TOP_OFFSET=10,t.msgTip=new n({position:{my:"left-"+t.LEFT_OFFSET+" top+"+t.TOP_OFFSET,at:"left bottom"},tooltipClass:"msg-container",arrow:!0,radius:!1,closebox:!1,shadow:!0,content:c,direction:"top",target:o("#my-home-exp"),open:function(){var e=this;t.offsetTop=o(e.getTipContainer()).offset().top;var i=o(".msg-container"),n=o(".msg-brief"),c=o(".msg-detail");c.on("mouseenter",".n-item",function(){o(this).addClass("hover")}).on("mouseleave",".n-item",function(){o(this).removeClass("hover")}),i.on("mouseenter",function(){n.addClass("hover"),c.show()}).on("mouseleave",function(){n.removeClass("hover"),c.hide()}).on("click",".item-close",function(e){try{var i=o(this),n=i.data("type")+"",c={};if("4"===n&&(c={group:1,maintype:""}),-1!=n.indexOf("cms")){var r=n.split("-")[1],m=a.get("EXP_MSG_CMS");m&&"-1"==m.indexOf(r)&&(m+="_"+r),a.set("EXP_MSG_CMS",m||r,{expires:6048e5,path:"/"}),s-=1,s>0?i.closest(".n-item").remove():t.msgTip.hide()}else t.readMessage(n,c,function(e){e.errno||(s-=1),s>0?i.closest(".n-item").remove():t.msgTip.hide()})}catch(e){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:e.message,path:"common-jquery:widget/js/logic/msg/msg.js",method:"",ln:156})}}).on("click",".close-msg",function(){try{t.msgTip.hide()}catch(e){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:e.message,path:"common-jquery:widget/js/logic/msg/msg.js",method:"",ln:159})}})}})}},noticeSingleTpl:function(e){if(e.count){e=o.extend({url:"/user/nuc/message",count:0,item:"系统通知",mid:4},e||{});var i=['<div class="n-item clearfix">','<a href="'+e.url+'">',"有<b>"+e.count+"</b>个"+e.item,"</a>",'<span class="item-close" data-type="'+e.mid+'"></span>',"</div>"].join("");return i}},get:function(){var e=this;o.get("/notice/getSystemNoticeCount?t="+(new Date).getTime(),function(i){if(!i.errno&&i.msg){var i=i.msg;if(i){var t=[],n=0;o.each(i,function(i,a){if(0!==a.count)switch(a.maintype){case 2:t.push(e.noticeSingleTpl({url:"/user/nuc/interact?tab=followed",count:a.count,item:"新粉丝",mid:2})),n++;break;case 3:t.push(e.noticeSingleTpl({url:"/user/nuc/interact?tab=comment",count:a.count,item:"新评论",mid:3})),n++;break;case 0:t.push(e.noticeSingleTpl({url:"/user/nuc/message",count:a.count,item:"系统通知",mid:4})),n++;break;case 13:if(t.push(e.noticeSingleTpl({url:"/user/nuc/message",count:a.count,item:"有得通知",mid:13})),n++,a.question){var p=[],f=a.question[0];o.each(a.question,function(e){p.push(e.messageid)}),s.alert(['<div class="que-rol-pop">',"<h3>疑问解决！</h3>","<p>感谢你的耐心答复！</p>","<p>用户对你的经验《",'<a target="_blank" href="/article/'+f.eidEnc+'.html">',f.content,"</a>","》疑问已解决。","</p>","</div>"].join(""),{width:400,height:250,close:function(){e.readMessage(13,{mid:p})}})}break;case 12:break;case 31:break;case 10:c.init(a.withdraw[0],a.maintype);break;case 21:r.init(a);break;case 22:g.init(a);break;case 36:u.init(a);break;case 37:m.init(a);break;case 40:l.init(a);break;case 50:d.init(a)}}),F.context("msg_topic")&&F.context("msg_topic").length&&o.each(F.context("msg_topic"),function(e,i){var o=a.get("EXP_MSG_CMS");if(!(o&&-1!=o.indexOf(i.stamp)||(new Date).getTime()>new Date(i.end).getTime())){var s=i.msg,c=i.link;""!=c&&(s='<a log="'+i.log+'" href="'+c+'" target="_blank">'+s+"</a>"),n++;var r=1!=n&&0==e?" has-border-top":"";t.push(['<div class="n-item n-cms'+r+' clearfix">',s,'<span class="item-close" data-type="cms-'+i.stamp+'"></span>',"</div>"].join(""))}}),t&&e.show(t,n)}}},"json")},getTypeFromPage:function(){var e=location.href;return-1!=e.indexOf("/user/nuc")?-1!=e.indexOf("followed")?2:-1!=e.indexOf("comment")?3:-1!=e.indexOf("message")?4:-1:-1},init:function(){try{var e=this;if(!F.context("user").isLogin)return;if(location.href!=top.location.href)return;var i=e.getTypeFromPage();-1==i?e.get():(e.readMessage(i),setTimeout(e.get,1e3)),o(window).on("scroll resize",function(){e.resize()})}catch(t){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:t.message,path:"common-jquery:widget/js/logic/msg/msg.js",method:"",ln:414})}},resize:function(){var e=this;if(e.msgTip){var i=e.msgTip.getTipContainer(),t=i.css("top"),s=o(e.msgTip.target),n=s.offset().left,a=(s.width(),n-e.LEFT_OFFSET+7);if(o.browser.ie&&o.browser.ie<7){t=o(window).height()+o(window).scrollTop();var c=o(i).height();t=t-c-3+"px",o(i).css({top:t,right:"auto",left:a,position:"absolute",overflow:""})}else{var r;r=o(window).scrollTop()>e.offsetTop?0:e.offsetTop,o(i).css({top:r,left:a,bottom:"auto",right:"auto",position:"fixed",overflow:""})}}}};t.exports=p});
;define("common-jquery:widget/js/logic/msg/amazing-2016/amazing-2016.js",function(e,i,a){var o=e("common-jquery:widget/lib/jquery/jquery.js"),s=e("common-jquery:widget/js/ui/dialog/dialog.js"),n={init:function(i){try{var a=this;a.options=i;var n="";void 0!==F.context("userName")&&(n=F.context("userName")+"，");{var t=['<div class="wrapper">',"<header>",'<div class="cur-pointer close-dialog close-x"></div>',"</header>",'<div class="content">',"<p>"+n+" 你太了不起了！</p>",'<p class="mr-34">《了不起的任务》活动中你领取的任务<br/>已经完成啦,<em>恭喜你</em></p>',"<h2>点击按钮领取新任务或者查看任务奖励吧</h2>",'<div class="amazing-btn">了不起的任务</div>',"</div>","</div>"].join(""),m=e("common-jquery:widget/js/logic/msg/msg.js");s.alert(t,{width:637,height:372,className:"dialog-amazing",open:function(){o(".amazing-btn").click(function(){try{window.open("/activity/lbq2016"),m.readMessage(22,{mid:a.options.messageid})}catch(e){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:e.message,path:"common-jquery:widget/js/logic/msg/amazing-2016/amazing-2016.js",method:"",ln:42})}})},close:function(){m.readMessage(22,{mid:a.options.messageid})}})}}catch(c){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:c.message,path:"common-jquery:widget/js/logic/msg/amazing-2016/amazing-2016.js",method:"",ln:52})}}};a.exports=n});
;define("common-jquery:widget/js/ui/tip/tip.js",function(t,i,e){var o=t("common-jquery:widget/lib/jquery/jquery.js"),s=t("common-jquery:widget/js/ui/base/base.js");t("common-jquery:widget/lib/jquery.ui/jquery.ui.tooltip.js"),e.exports=s(function(t){var i=this;i.position=o.extend({my:"left top",at:"left bottom+10",collision:"none",using:function(e,s){"popcms"!=t.rightbottom&&o(this).css(e),i.arrow&&o("<div>").addClass("tip-arrow").addClass("tip-arrow-"+(i.direction||s[s.important])).html("<em></em><span></span>").appendTo(this),i.closebox&&(o('<a href="#" class="tip-close" title="关闭">×</a>').addClass(s.vertical).addClass(s.horizontal).click(function(t){try{t.preventDefault(),i.autoDispose?i.close():i.hide(),i.fire("closeall")}catch(t){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:t.message,path:"common-jquery:widget/js/ui/tip/tip.js",method:"",ln:44})}}).appendTo(this),o(this).addClass("tip-has-close")),i.shadow&&o(this).addClass("tip-shadow"),i.radius&&o(this).addClass("tip-radius")}},t.position),delete t.position,i.content="",i.target="",i.tooltipClass="",i.arrow=!0,i.closebox=!1,i.shadow=!0,i.radius=!0,i.autoDispose=!0,i.effect=!0}).extend({init:function(t){try{var i=this;if(i.target=o(i.target),0==i.target.size())return;i.target.attr("title")||i.target.attr("title",""),i.target.tooltip({content:i.content,position:i.position,tooltipClass:i.tooltipClass,open:function(t){i.fire("onopen",t)},close:function(t){i.fire("onclose",t)}}),i.instance=i.target.data("ui-tooltip"),i.target.tooltip("open",{target:i.instance.element}),i._status="show",t.autoDisplay===!1&&this.close()}catch(e){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:e.message,path:"common-jquery:widget/js/ui/tip/tip.js",method:"",ln:99})}},getTipContainer:function(){return this.instance._find(o(this.target))},getTipBody:function(){return this.getTipContainer().find(".ui-tooltip-content")},getStatus:function(){return this._status},open:function(){var t=this.target;t.attr("title")||t.attr("title",""),t.tooltip("open",{target:this.instance.element}),this._status="show",this.fire("show")},show:function(){this.autoDispose?this.open():(this.getTipContainer()[this.effect?"fadeIn":"show"](),this._status="show")},close:function(){this.target.tooltip("close"),this._status="hide"},hide:function(){this.autoDispose?this.close():(this.getTipContainer()[this.effect?"fadeOut":"hide"](),this._status="hide")}})});
;define("common-jquery:widget/js/ui/dialog/dialog.js",function(t,e,i){var n=t("common-jquery:widget/lib/jquery/jquery.js"),o=t("common-jquery:widget/js/util/event/event.js"),s=t("common-jquery:widget/js/ui/base/base.js");t("common-jquery:widget/lib/jquery.ui/jquery.ui.dialog.js");var a={},c=s().extend({init:function(t){try{var e=this;t=n.extend({modal:!0,closeText:"关闭",resizable:!1,draggable:!0,dialogClass:t.className,btnAlign:"center"},t||{}),e.instance=t.target?n(t.target).dialog(t):n("<div>",{id:"ik-dlg-"+e.guid}).html(t.content).dialog(t),n.isArray(t.buttons)&&e.customBttons(t.buttons),e.instance.next().css("text-align",t.btnAlign),t.autoDispose&&e.instance.on("dialogclose",function(){n(this).dialog("destroy").remove(),delete a[e.guid],e.isDestroy=!0}),a[e.guid]=e.instance,n(window).on("resize",function(){e&&e.center()})}catch(i){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:i.message,path:"common-jquery:widget/js/ui/dialog/dialog.js",method:"",ln:54})}},customBttons:function(t){var e=this,i=this.instance.next().children("div"),o=i.find("button");n(t).each(function(t){var o=this;!this.className&&2>t&&(this.className=["btn-32-green","btn-32-white"][t]+" mr-10"),n('<a href="#" />').text(this.text||"").appendTo(i).addClass(this.className||"").click(function(t){try{t.preventDefault(),o.click.apply(e.instance,arguments)}catch(t){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:t.message,path:"common-jquery:widget/js/ui/dialog/dialog.js",method:"",ln:69})}})}),o.remove()},open:function(){!this.isDestroy&&this.instance.dialog("open")},close:function(){!this.isDestroy&&this.instance.dialog("close")},center:function(){!this.isDestroy&&this.instance.dialog("option","position",{my:"center",at:"center",of:window})},getDialogContainer:function(){return this.isDestroy?null:this.instance.dialog("widget")},setSize:function(t){!this.isDestroy&&this.instance.dialog("option",t)},setTitle:function(t){!this.isDestroy&&t&&this.instance.dialog("option","title",t)}});o.on("dialog.close",function(){c.close()}),i.exports=n.extend(c,{alert:function(t,e){return e=n.extend({title:"经验提示",content:t,buttons:[{text:"确定",click:function(){try{n.isFunction(e.onaccept)&&e.onaccept.apply(this,arguments),n(this).dialog("close")}catch(t){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:t.message,path:"common-jquery:widget/js/ui/dialog/dialog.js",method:"",ln:113})}}}]},e||{}),new c(e)},confirm:function(t,e){return e.buttons=e.buttons||[{text:"确定",click:function(){try{n.isFunction(e.onaccept)&&e.onaccept.apply(this,arguments)}catch(t){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:t.message,path:"common-jquery:widget/js/ui/dialog/dialog.js",method:"",ln:123})}}},{text:"取消",click:function(){try{n.isFunction(e.oncancel)&&e.oncancel.apply(this,arguments),n(this).dialog("close")}catch(t){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:t.message,path:"common-jquery:widget/js/ui/dialog/dialog.js",method:"",ln:129})}}}],c.alert(t,e)},expConfirm:function(t,e){var i=n.extend({type:e.type||"warn",width:514,height:324,className:"exp-dialog",onaccept:function(){o.fire("dialog.close")}},e||{});switch(i.noFooter&&(i.className="exp-dialog no-footer"),i.type){case"warn":i.title="确认提示";break;case"error":i.title="错误提示";break;case"success":i.title="成功提示"}t=i.finalContent?i.finalContent:['<div class="exp-content clearfix">','<div class="grid bear">','<div class="i-'+i.type+'"></div>',"</div>",'<div class="grid content-text">',t,"</div>","</div>"].join(""),c.confirm(t,i)},iframe:function(t){var e='<iframe frameborder="no" class="ui-dialog-content-iframe" src="'+t.content+'"></iframe>';return t.content=e,t.buttons||(t.buttons=[]),t.dialogClass||(t.dialogClass="dialog-iframe"),c.alert(e,t)},notice:function(t,e){var e=n.extend({width:250,height:100},e||{}),i={buttons:[],width:e.width,height:e.height,dialogClass:"dialog-notice",autoDispose:!0,content:t,duration:1500,open:function(){var t=this;setTimeout(function(){n(t).dialog("close"),n.isFunction(e.callback)&&e.callback()},i.duration)}};return n.extend(i,e||{}),new c(i)},close:function(){n.each(a,function(t,e){try{e&&e.dialog("close")}catch(i){}})}})});