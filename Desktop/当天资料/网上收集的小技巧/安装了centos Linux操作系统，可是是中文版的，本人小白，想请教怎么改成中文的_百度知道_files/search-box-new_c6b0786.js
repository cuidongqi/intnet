define("common:widget/js/logic/search-box-new/search-box-new.js",function(e,t,o){function a(){var e=location.pathname,t="/"==e?"home":e.match(/\w+/)[0];return new RegExp("\\|"+t+"\\|").test("|search|question|home|browse|")?t:"other"}function i(e){var t={"http://news.baidu.com/":{query:"ns?cl=2&rn=20&tn=news&t=1&word=#{0}"},"http://www.baidu.com/":{query:"s?cl=3&wd=#{0}"},"http://tieba.baidu.com/":{query:"f?kw=#{0}&t=4"},"http://music.baidu.com/":{query:"search?fr=zhidao&key=#{0}"},"http://image.baidu.com/":{query:"search/index?tn=baiduimage&ct=201326592&lm=-1&cl=2&word=#{0}&t=3&ie=gbk"},"http://v.baidu.com/":{query:"v?ct=301989888&rn=20&pn=0&db=0&s=22&word=#{0}"},"http://map.baidu.com/":{query:"m?word=#{0}&fr=map007",encode:!0},"http://baike.baidu.com/":{query:"searchword/?word=#{0}&pic=1"},"http://wenku.baidu.com/":{query:"search?word=#{0}&lm=0&od=0"},"http://jingyan.baidu.com/":{query:"search?word=#{0}&fr=zhidao",encode:!0}},o=s.trim(e);s(".search-box-new .channel a").each(function(){var e="http://"+this.hostname+"/";if(""!=o){if(t[e]){var a=t[e],i=a.encode?encodeURIComponent(o):o;this.href=e+s.string(a.query).format([i])}}else this.href=e})}var s=e("common:widget/js/util/tangram/tangram.js"),n=e("common:widget/js/ui/suggestion-new/suggestion-new.js"),c=e("common:widget/js/util/event/event.js"),r=e("common:widget/js/util/form/form.js"),d=e("common:widget/js/util/log/log.js"),h=e("common:widget/js/ui/dialog/dialog.js");e("common:widget/lib/jquery.placeholder/jquery.placeholder.js");new n({target:"#kw",mark:!1,beforeinit:function(){try{this.checkDisabled=function(){return"1"==s.cookie.get("IK_SUG")}}catch(e){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:e.message,path:"common:widget/js/logic/search-box-new/search-box-new.js",method:"",ln:23})}},open:function(){var e=s(this.target).autocomplete("widget"),t=s.trim(s(this.target).val()),o=parseInt(e.css("top"),10);e.css({top:o-1}),0==e.find(".ui-menu-item-close").size()&&(s("<li>").addClass("ui-menu-item-close").html('<a href="#">\u5173\u95ed</a>').appendTo(e),e.find(".ui-menu-item a").each(function(){s(this).html(this.innerHTML.replace(new RegExp(t,"i"),function(e){return"<em>"+e+"</em>"}))})),e.find(".ui-menu-item").size()>5&&(e.addClass("sug-plus"),this.mark=!0),e.find(".ui-menu-item").size()<5&&1==this.mark&&(e.removeClass("sug-plus"),this.mark=!1)},create:function(){var e=this,t=s(e.target).autocomplete("widget");t.delegate(".ui-menu-item-close a","click",function(t){try{t.preventDefault(),s(e.target).autocomplete("close").autocomplete("destroy"),s.cookie.set("IK_SUG","1")}catch(t){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:t.message,path:"common:widget/js/logic/search-box-new/search-box-new.js",method:"",ln:58})}})},select:function(e,t){u.val(t.item.value),c.fire("searchBoxNew.addLog",{f:"sug"}),o.exports.search(u)},close:function(){(this.mark=!0)&&s(".ui-autocomplete").removeClass("sug-plus")}});!function(){function e(){var e=o.width(),t=s("#header").width(),n=(e-t)/2;1070>e&&(a.css({right:"auto",left:721,display:"block"}),i.css({width:330,left:863,display:"block"})),e>=1070&&1110>e&&(a.css({right:"auto",left:710+n,display:"block"}),i.css({width:330,left:735+n+142,display:"block"})),e>=1110&&1175>e&&(a.css({right:"auto",left:741+n,display:"block"}),i.css({width:330,left:735+n+142,display:"block"})),e>=1175&&1903>e&&(a.css({right:"auto",left:755+n,display:"block"}),i.css({width:"auto",left:"auto",right:13,display:"block"})),e>=1903&&(a.css({right:"auto",left:896+n,display:"block"}),i.css({width:"auto",left:"auto",right:13,display:"block"}))}function t(){var e=o.width();1100>e&&i.css({left:800,width:360,display:"block"}),e>1100&&i.css({left:"auto",right:13,width:"auto",display:"block"})}if(!s("body").hasClass("zhidao-index")){{var o=s(window),a=s("#header").children(".adTopImg"),i=s(".userbar");i.width(),s(".search-cont"),s("#search-box ul")}s("body").hasClass("has-menu")?(e(),o.on("resize",function(){e(),s(window).width()<=1175&&s(".zhidao-new-message-tip").css({left:980,width:s(".zhidao-new-message-tip").width(),right:"auto"}),s(window).width()>1175&&s(".zhidao-new-message-tip").css({right:49,width:"auto",left:"auto"})})):(t(),o.on("resize",function(){t(),s(window).width()<=1100&&s(".zhidao-new-message-tip").css({left:865,width:s(".zhidao-new-message-tip").width(),right:"auto"}),s(window).width()>1100&&s(".zhidao-new-message-tip").css({right:49,width:"auto",left:"auto"})})),o.on("scroll",function(){setTimeout(function(){var e=s(this),t=s(".search-block");void 0===t.attr("mark")&&t.attr("mark","off"),e.scrollTop()>38&&"off"===t.attr("mark")&&(t.addClass("under-shadow").attr("mark","on"),a.css("display","none")),e.scrollTop()<38&&"on"===t.attr("mark")&&(t.removeClass("under-shadow").attr("mark","off"),a.css("display","block"))},200)})}}();var l={lm:0,rn:10,pn:0,fr:"search",ie:"gbk"},u=s("#kw"),m=s.json.parse(F.context("defaultQuery"));d.init({type:8888,action:"click",query:".channel"}),s("#search-form-new").submit(function(e){d.send({type:2014,pms:"newqb",action:"searchbtnNew"}),e.preventDefault(),o.exports.search(u)}),s("#ask-btn-new").click(function(e){try{d.send({type:2014,pms:"newqb",action:"askbtnNew"}),e.preventDefault(),o.exports.ask(u)}catch(e){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:e.message,path:"common:widget/js/logic/search-box-new/search-box-new.js",method:"",ln:260})}}),u.blur(function(){i(s(this).val())}),o.exports.search=function(e){e=s(e);var t=s.string(e.val()).trim();m&&(t=t==m.title?m.value:t),""==t?c.fire("searchBoxNew.buttonAction",{text:"\u8bf7\u8f93\u5165\u60a8\u8981\u641c\u7d22\u7684\u95ee\u9898",evtName:"searchAction",log:"btn=search",fr:"search_0"}):c.fire("searchBoxNew.searchAction",{params:{word:t},extParams:s.url.queryToJson(e.attr("extAttr")||"")})},o.exports.ask=function(e){e=s(e);var t=!m||e.val()!=m.title&&e.val()!=m.value?e.val():"",o=new r({method:"get",action:"/new",input:{word:t,ie:"GBK"}});setTimeout(function(){o.submit()},60)};var p={};c.on("searchBoxNew.addLog",function(e,t){s.extend(p,t)}),c.on("searchBoxNew.searchAction",function(e,t){var o={};s.extend(o,l),s.extend(o,t.params),s.extend(o,t.extParams||s.url.queryToJson(u.attr("extAttr")||"")),d.send(s.extend({type:2057,fr:a(),word:t&&t.params&&t.params.word?t.params.word:""},p)),p={};var i=new r({method:"get",action:"/search",input:o});setTimeout(function(){i.submit()},60)}),c.on("searchBoxNew.buttonAction",function(e,t){var o=['<div class="mb-10 mt-10"><i class="i-set-noname mr-5"></i>',t.text,"\uff1a</div>",'<input style="width: 300px; padding: 3px;" id="search-empty-input" type="text"/>'].join("");h.alert(o,{width:370,height:180,dialogClass:"dialog-search-empty",btnAlign:"left",autoDispose:!0,buttons:[{text:"\u7ee7\u7eed\u641c\u7d22",click:function(){try{var e=s.string(s("#search-empty-input").val()).trim();""!=e&&c.fire("searchBoxNew.searchAction",{params:{word:e,fr:t.fr,lm:t.lm||0}})}catch(o){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:o.message,path:"common:widget/js/logic/search-box-new/search-box-new.js",method:"",ln:414})}}}],open:function(){var e=s(".dialog-search-empty .ui-dialog-buttonpane");s("#search-empty-input").get(0).focus(),s("#search-empty-input").keypress(function(t){13==t.keyCode&&s(e).find(".btn-32-green").click()}),s(".ui-dialog-content").css("min-height","95px"),s(".ui-dialog-buttonset").css("text-align","center")}})})});