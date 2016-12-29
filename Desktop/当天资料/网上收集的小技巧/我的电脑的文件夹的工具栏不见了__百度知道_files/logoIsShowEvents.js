/**
 * @file 广告标识点击显示logo
 * @author qianxiaoli@baidu.com
 */
var logoIsShowEvent = {
    run: function () {
        var fbIcon = document.getElementById('fbIconDiv');
        var logoArea = document.getElementById('logoArea');
        if (!fbIcon) {
            var adIcon = document.getElementById('mob-bd-adIcon') || document.getElementById('bd-adIcon');
            if (adIcon) {
                logoArea.style.display = 'none';
                this.bind(adIcon, 'click', this.logoAreaClk);
            }
            else {
                this.bind(logoArea, 'click', this.logoAreaClk);
            }
        }
        else {
            logoArea.style.display = 'none';
            this.bind(fbIcon, 'click', this.logoAreaClk);
        }
    },

    logoAreaClk: function (e) {
        try {
            var logo = document.getElementById('bd-logo') || document.getElementById('bd-logo4');
            logo.style.display = 'block';
        } catch (e) {}
    },
    bind: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else {
            element.attachEvent('on' + type, handler);
        }
    },
    getAttr: function (element, key) {
        if (element && element.getAttribute) {
            return element.getAttribute(key);
        } else {
            return element[key];
        }
    },
    formatEventObj: function (e) {
        e = e || window.event;
        e.target = e.target || e.srcElement;
        return e;
    },
    // 阻止默认行为
    stopEvent: function (event) {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }
        else {
            window.event.cancelBubble = true;
        }
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        return false;
    }
};
this.logoIsShowEvent.run();