define("question:widget/sample/user/nologin-daily/nologin-daily.js",function(o){var i=o("common:widget/js/util/tangram/tangram.js"),e=o("common:widget/js/util/log/log.js");i("#wgt-nologin-daily").click(function(o){try{o.stopPropagation(),i(o.target).closest("#daily-carousel").size()&&!i(o.target).closest(".carousel-control").size()&&e.send({type:2014,page:"question",pos:"no-login-daily",action:"click"})}catch(o){"undefined"!=typeof alog&&alog("exception.fire","catch",{msg:o.message,path:"question:widget/sample/user/nologin-daily/nologin-daily.js",method:"",ln:16})}}),e.send({type:2014,page:"question",pos:"no-login-daily",action:"pv"})});