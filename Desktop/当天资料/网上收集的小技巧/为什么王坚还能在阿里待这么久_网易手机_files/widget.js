;(function (G,D) {

function locQuery(){
    var qs = location.search,
        reg = /(?:^\?|&)(.*?)=(.*?)(?=&|$)/g,
        obj = {}, tmp;

    if(!qs){
        return obj;
    }

    while((tmp = reg.exec(qs)) != null) {
        obj[decodeURIComponent(tmp[1])] = decodeURIComponent(tmp[2]);
    }

    return obj;
}

if(G.MT_DOM_FILTER === undefined){
    G.MT_DOM_FILTER = {};
}

if(G.MT_PARAMS === undefined){// create G.MT_PARAMS conf if not exist
    G.MT_PARAMS = {};
}

if((G.MT_JS_URLS === undefined)
    || G.MT_CSS_URLS === undefined){
    return;
}

var qsParams = locQuery(),
    motuConfs = {
        "MotuAppConfs":{
            "widgets": G.MT_WIDGET_CONFS || [],
            "trackConf":{
                "adTrackAccount":"",
                "adTrackTimerSwitch": true,
                "TIME_LOAD_BEGIN":""
            },
            "baseFilter": [G.MT_DOM_FILTER.include || "img", G.MT_DOM_FILTER.exclude || "#motu img"],
            "debugJsonProxy": G.MT_DEBUG_PROXY || "http:\/\/localhost:8888\/PHP\/jsonproxy.php",
            "_ts": +new Date(),
            "STATIC_URL": G.MT_STATICS_URL || "http:\/\/statics.motu.pagechoice.net\/statics\/",
            "APS_URL": G.MT_APS_URL || "http:\/\/motu.pagechoice.net",
            "RULE_API": G.MT_RULE_API || "http:\/\/dap.pagechoice.net\/dap\/www\/delivery\/mmt.php",
            "LUCKY_GUEST": G.MT_LUCKY_GUY || false
        },
        "motuZoneId": qsParams.motu_zone_id || G.MT_ZONE_ID || null,
        "preprocessModule": qsParams.motu_pre_module || G.MT_PREPARE_MODULE || null,
        "mode": qsParams.motu_debug_mode || G.MT_DEBUG_MODE || "product",
        "scripts": G.MT_JS_URLS,
        "styles": G.MT_CSS_URLS
    },
    head=D.getElementsByTagName("head")[0],
    inited = false,
    ie=!-[1,],
    ie6=ie && !G.XMLHttpRequest,
    queue = [],
    onAllLoad,
    dsBaseURL,
    dsScriptURL,
    qjs=/Firefox\/3\.6/i.test(navigator.userAgent)?function (s) {
        s.async=false;
        head.appendChild(s);
    }:function(s) {
        queue.push(s);
        if (!inited) {inited=true;nextJs();}
    };

G.MotuAppConfs=motuConfs.MotuAppConfs;
G.MotuAppConfs.mode=motuConfs.mode;

if((G.MotuAppConfs.widgets.length === 0)
    && G.MotuAppConfs.RULE_API === ''){
    return;
}
G.MotuAppConfs.trackConf['TIME_LOAD_BEGIN'] = +new Date();

map(css,motuConfs.styles[ie6?'ie6':'common']);
map(js,motuConfs.scripts);

function css(url) {
    var a=D.createElement("link");
    a.setAttribute("rel","stylesheet");
    a.setAttribute("type","text/css");
    a.setAttribute("href",G.MotuAppConfs.STATIC_URL+url);
    if(url.indexOf('http') === 0){
        a.setAttribute("href",url);
    }else{
        a.setAttribute("href",G.MotuAppConfs.STATIC_URL+url);
    }
    head.appendChild(a);
}

function nextJs() {
    var s = queue.shift();
    if (!s){
        return inited=false;
    }
    if (ie) {
        s.onreadystatechange=function () {
            if (/loaded|complete/i.test(s.readyState)) nextJs();
        };
    } else {
        s.onload=nextJs;
    }
    head.appendChild(s);
}

function js(url) {
    var a = D.createElement('script');
    a.setAttribute('type','text/javascript');
    a.setAttribute('charset','utf-8');
    if(url.indexOf('http') === 0){
        a.setAttribute('src',url);
    }else{
        a.setAttribute('src',G.MotuAppConfs.STATIC_URL+url);
    }
    qjs(a);
}

function map(fn,list,_a) {
    list=list.slice();
    while (_a=list.shift()) fn(_a);
}

})(window, document);
