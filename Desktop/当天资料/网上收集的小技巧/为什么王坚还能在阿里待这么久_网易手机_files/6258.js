;(function(G, D) {

    /**
     * Site: 网易
     * Domain: *.163.com
     * ZoneID: 6258
     * API: Dap
     */

    /* STD Base settings */
    G.MT_EDITION_TYPE = "Std";
    G.MT_DEBUG_MODE = "product";
    G.MT_STATICS_URL = "http:\/\/statics.motu.pagechoice.net\/statics\/";
    G.MT_APS_URL = "http:\/\/motu.pagechoice.net";
    G.MT_JS_URLS = ["build/Std/motu.min.js"];
    G.MT_CSS_URLS = {
        "common": ["build/Std/motu.min.css"],
        "ie6": ["build/Std/motu-ie6.min.css"]
    };

    /* Production settings */
    G.MT_RULE_API = "http:\/\/dap.gentags.net\/dap\/www\/delivery\/mmt.php";
    G.MT_DOM_FILTER = {
        "include": "#endText img, #photoView img, .nph_photo .nph_photo_view .nph_cnt img, .autocard_slide, .content_img_wrap img",
        "exclude": ".autocard_slide img"
    };

    G.MT_ZONE_ID = 6258;

    G.MT_PREPARE_MODULE = "Motu.std.preprocess.NetEaseCar";
    G.MT_MAX_ZINDEX = 9000;

    /* widget.js加载 */
    var h = D.getElementsByTagName('head')[0],
        s = D.createElement('script');
    s.type = 'text/javascript';
    s.charset = 'utf-8';
    s.src = G.MT_STATICS_URL + 'widget.js';
    h.firstChild ? h.insertBefore(s, h.firstChild) : h.appendChild(s);

})(window, document);
