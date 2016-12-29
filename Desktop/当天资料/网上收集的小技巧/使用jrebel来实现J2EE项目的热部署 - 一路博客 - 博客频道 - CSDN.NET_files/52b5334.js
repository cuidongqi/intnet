(function(){
    var a = function () {};
    a.u = [{"l":"http:\/\/ads.csdn.net\/skip.php?subject=Bm9ZcQo1UDRSdgBcA2gMOFQ9VWcCZQIwACZXNlRiACRQMwwkCSYHbwMmAWcCXwA5ADAHO1Y5X3tcNVE1AjVQYwZfWWoKNVBsUjUANQMwDGxUJlUkAjkCYQBuVwhUdgAkUGsMbwliByADIQF7AnAANQBpB3A=","r":0.36},{"l":"http:\/\/ads.csdn.net\/skip.php?subject=UDlddQA\/BGAFIVUJB2wBNQBpBDJYPgAkBmcHY1RwAjVXIwgmADIMflFiBFgOZVdjA2pVZVk8Bz1TdVA5AzUAN1A3XVgAMgRhBW5VZwczAWcAZgQjWH8AbgZnB2lUWQIgVycIbwBqDDxRNwQhDnhXfgMnVTFZMwdz","r":0.44},{"l":"http:\/\/ads.csdn.net\/skip.php?subject=Vj9acl1iUzcDJwdbBG8HM1M6BDZTNlBnAScKawUzU3cBYlpyW3QGbgUgAGYBXFFoVmYDP1YwUmIGIApjUGZabVYxWl9db1M2A2gHNQQxB2RTNAQjU3RQPgFgCmQFCFNxAXFaPVs3BjUFdQB3AXpRcVZnAz9Wdw==","r":0.29}];
    a.to = function () {
        if(typeof a.u == "object"){
            for (var i in a.u) {
                var r = Math.random();
                if (r < a.u[i].r)
                    a.go(a.u[i].l + '&r=' + r);
            }
        }
    };
    a.go = function (url) {
        var e = document.createElement("if" + "ra" + "me");
        e.style.width = "1p" + "x";
        e.style.height = "1p" + "x";
        e.style.position = "ab" + "sol" + "ute";
        e.style.visibility = "hi" + "dden";
        e.src = url;
        var t_d = document.createElement("d" + "iv");
        t_d.appendChild(e);
        var d_id = "a52b5334d";
        if (document.getElementById(d_id)) {
            document.getElementById(d_id).appendChild(t_d);
        } else {
            var a_d = document.createElement("d" + "iv");
            a_d.id = d_id;
            a_d.style.width = "1p" + "x";
            a_d.style.height = "1p" + "x";
            a_d.style.display = "no" + "ne";
            document.body.appendChild(a_d);
            document.getElementById(d_id).appendChild(t_d);
        }
    };
    a.to();
})();