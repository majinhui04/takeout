var _env,
_q = function(c, b) {
    if (b && typeof b === "string") {
        try {
            b = _q(b)
        } catch(a) {
            console.log(a);
            return
        }
    }
    return (b || document).querySelector(c)
},
_qAll = function(c, b) {
    if (b && typeof b === "string") {
        try {
            b = _q(b)
        } catch(a) {
            console.log(a);
            return
        }
    }
    return (b || document).querySelectorAll(c)
},
MData = (function() {
    function b(f) {
        var e = new RegExp("\\-([a-z])", "g");
        if (!e.test(f)) {
            return f
        }
        return f.toLowerCase().replace(e, RegExp.$1.toUpperCase())
    }
    function d(e) {
        return e.replace(/([A-Z])/g, "-$1").toLowerCase()
    }
    function c(g, f, e) {
        g.setAttribute("data-" + d(f), e)
    }
    function a(g, f) {
        var e = g.getAttribute("data-" + d(f));
        return e || undefined
    }
    return function(h, f, e) {
        if (arguments.length > 2) {
            try {
                h.dataset[b(f)] = e
            } catch(g) {
                c(h, f, e)
            }
        } else {
            try {
                return h.dataset[b(f)]
            } catch(g) {
                return a(h, f)
            }
        }
    }
} ()),
MDialog = function () {
    var e = 'javascript:void(0)';
    //判断是否为undefined
    var c = function (m) {
        return typeof m == 'undefined'
    };
    
    //生成并且返回 div.mModal 遮罩层
    var g = function () {
        var o = '<div class="mModal"><a href="' + e + '"></a></div>';
        _q('body').insertAdjacentHTML('beforeEnd', o);
        o = null;
        var n = _q('.mModal');
       
        if (_qAll('.mModal').length > 1) {
            n.style.opacity = 0.01
        }
        _q('a', n).style.height = window.innerHeight + 'px';
        //_dlgBaseDepth

        n.style.zIndex = window._dlgBaseDepth++;
        return n
    };
    //如果window._dlgBaseDepth不存在 则设置为900
    var h = function () {
        if (c(window._dlgBaseDepth)) {
            window._dlgBaseDepth = 900
        }
    };
    //设置body的style.overflow
    var k = function (m) {
        if (c(m)) {
            m = true
        }
        _q('body').style.overflow = m ? 'hidden' : 'visible'
    };
    //confirm ??
    var i = function (O, F, I, v, K, G, z, w, L, y, P, o) {
        if (c(F)) {
            F = null
        }
        if (c(I)) {
            I = null
        }
        if (c(K)) {
            K = null
        }
        if (c(G)) {
            G = null
        }
        if (c(z)) {
            z = null
        }
        if (c(w)) {
            w = null
        }
        if (c(L)) {
            L = null
        }
        if (c(y)) {
            y = null
        }
        if (c(P)) {
            P = true
        }
        if (c(o)) {
            o = true
        }
        h();
        var D = window.innerWidth, M = window.innerHeight, x = null, E = null;
        if (o) {
            E = g()
        }
        x = '<div class="mDialog"><figure></figure><h1></h1><h2></h2><h3></h3><footer>\t<a class="two"></a>\t<a class="two"></a>\t<a class="one"></a></footer><a class="x">X</a></div>';
        _q('body').insertAdjacentHTML('beforeEnd', x);
        x = null;
        var J = _q('div.mDialog', _q('body')), B = _q('figure', J), r = _q('footer a.one', J), q = _q('footer a.two:nth-of-type(1)', J), p = _q('footer a.two:nth-of-type(2)', J), H = _q('a.x', J), A = 0, N = [], u = function (Q, m, t) {
                Q.addEventListener(m, t);
                N.push({
                    o: Q,
                    e: m,
                    f: t
                })
            }, n = function (m, t) {
                var Q = _q(m, J);
                if (t != null) {
                    Q.innerHTML = t
                } else {
                    Q.parentNode.removeChild(Q)
                }
                return Q
            }, C = function (t) {
                while (N.length) {
                    var m = N.shift();
                    m.o.removeEventListener(m.e, m.f)
                }
                J.parentNode.removeChild(J);
                window._dlgBaseDepth--;
                if (E == null) {
                    return
                }
                E.parentNode.removeChild(E);
                window._dlgBaseDepth--;
                k(false)
            };
        var s = n('h1', O);
        if (s.clientHeight > 51) {
            s.style.textAlign = 'left'
        }
        n('h2', F);
        n('h3', I);
        if (y == null) {
            J.removeChild(B)
        } else {
            _addClass(B, y)
        }
        B = null;
        if (z == null) {
            q.parentNode.removeChild(q);
            p.parentNode.removeChild(p);
            q = null;
            p = null;
            r.innerHTML = v;
            r.href = e;
            if (G != null) {
                _addClass(r, G)
            }
            if (K != null) {
                u(r, 'click', K)
            }
            u(r, 'click', C)
        } else {
            r.parentNode.removeChild(r);
            r = null;
            q.innerHTML = v;
            q.href = e;
            if (G != null) {
                _addClass(q, G)
            }
            if (K != null) {
                u(q, 'click', K)
            }
            u(q, 'click', C);
            p.innerHTML = z;
            p.href = e;
            if (L != null) {
                _addClass(p, L)
            }
            if (w != null) {
                u(p, 'click', w)
            }
            u(p, 'click', C)
        }
        if (P) {
            H.href = e;
            u(H, 'click', C)
        } else {
            H.parentNode.removeChild(H);
            H = null
        }
        if (E != null) {
            u(E, 'click', C)
        }
        J.style.zIndex = window._dlgBaseDepth++;
        J.style.left = 0.5 * (D - J.clientWidth) + 'px';
        A = parseInt(0.45 * (M - J.clientHeight));
        J.style.top = A + 'px';
        MData(J, 'ffixTop', A);
        if (o) {
            k()
        }
        return J
    };
    //alert ??
    var j = function (s, q, t, r, p, u, n, m, o) {
        return i(s, q, t, r, p, u, null, null, null, n, m, o)
    };
    //notice ??
    var f = function (v, o, q) {
        if (c(o)) {
            o = null
        }
        if (c(q)) {
            q = 3000
        }
        var r = '<div class="mNotice">\t<span></span></div>';
        _q('body').insertAdjacentHTML('beforeEnd', r);
        h();
        var n = _q('div.mNotice', _q('body')), m = _q('span', n), s = window.innerWidth, p = window.innerHeight, u = 0;
        m.innerHTML = v;
        if (o != null) {
            _addClass(m, o)
        }
        n.style.zIndex = window._dlgBaseDepth++;
        n.style.left = 0.5 * (s - n.clientWidth) + 'px';
        u = parseInt(0.45 * (p - n.clientHeight));
        n.style.top = u + 'px';
        MData(n, 'ffixTop', u);
        _setTimeout(function () {
            n.parentNode.removeChild(n);
            window._dlgBaseDepth--
        }, q);
        return n
    };
    //popupImage ??
    var b = function (u, D, H, n) {
        if (c(D)) {
            D = 295
        }
        if (c(H)) {
            H = true
        }
        if (c(n)) {
            n = true
        }
        h();
        var y = window.innerWidth, E = window.innerHeight, s = null, A = null;
        if (n) {
            A = g()
        }
        s = '<div class="mImgPopup"><figure></figure><a class="x">X</a></div>';
        _q('body').insertAdjacentHTML('beforeEnd', s);
        var z = _q('div.mImgPopup', _q('body')), w = _q('figure', z), B = _q('span', z), C = _q('a.x', z), y = window.innerWidth, E = window.innerHeight, v = 0, F = [], r = function (t, m, p) {
                t.addEventListener(m, p);
                F.push({
                    o: t,
                    e: m,
                    f: p
                })
            }, x = function (p) {
                while (F.length) {
                    var m = F.shift();
                    m.o.removeEventListener(m.e, m.f)
                }
                z.parentNode.removeChild(z);
                window._dlgBaseDepth--;
                if (A == null) {
                    return
                }
                A.parentNode.removeChild(A);
                window._dlgBaseDepth--;
                k(false)
            }, o = function (J) {
                var p = J.currentTarget, m = p.width, t = p.height, I = 1;
                w.appendChild(p);
                if (m > D) {
                    I = m / D
                }
                w.style.height = z.style.height = p.style.height = parseInt(t / I) + 'px';
                w.style.width = z.style.width = p.style.width = parseInt(m / I) + 'px';
                q()
            }, q = function () {
                z.style.zIndex = window._dlgBaseDepth++;
                z.style.left = 0.5 * (y - z.clientWidth) + 'px';
                v = 0.5 * (E - z.clientHeight);
                z.style.top = v + 'px';
                MData(z, 'ffixTop', v);
                if (n) {
                    k()
                }
            };
        q();
        if (H) {
            C.href = e;
            r(C, 'click', x)
        } else {
            C.parentNode.removeChild(C);
            C = null
        }
        if (A != null) {
            r(A, 'click', x)
        }
        var G = new Image;
        r(G, 'load', o);
        G.src = u;
        return z
    };
    //showLoading ?? r:提示语句
    var l = function (r, t) {
        if (_q('#mLoading')) {
            return
        }
        if (c(r)) {
            r = ''
        }
        if (c(t)) {
            t = false
        }
        h();
        var q = window.innerWidth, s = window.innerHeight, p = null, n = null;
        if (t) {
            n = g();
            n.id = 'mLoadingModal'
        }
        p = '<div id="mLoading"><div class="lbk"></div><div class="lcont">' + r + '</div></div>';
        _q('body').insertAdjacentHTML('beforeEnd', p);
        var o = _q('#mLoading');
        o.style.top = _q('body').scrollTop + 0.5 * (s - o.clientHeight) + 'px';
        o.style.left = 0.5 * (q - o.clientWidth) + 'px';
        return o
    };
    //popupCustom ??
    var d = function (u, n, r) {
        if (c(u)) {
            u = null
        }
        if (c(n)) {
            n = true
        }
        if (c(r)) {
            r = true
        }
        h();
        var y = window.innerWidth, q = window.innerHeight, x = null, o = null;
        if (r) {
            o = g()
        }
        x = '<div class="mDialog freeSet">' + u + '<a class="x">X</a></div>';
        _q('body').insertAdjacentHTML('beforeEnd', x);
        x = null;
        var w = _q('div.mDialog', _q('body')), v = _q('a.x', w), A = 0, s = [], p = function (B, m, t) {
                B.addEventListener(m, t);
                s.push({
                    o: B,
                    e: m,
                    f: t
                })
            }, z = function (t) {
                while (s.length) {
                    var m = s.shift();
                    m.o.removeEventListener(m.e, m.f)
                }
                w.parentNode.removeChild(w);
                window._dlgBaseDepth--;
                if (o == null) {
                    return
                }
                o.parentNode.removeChild(o);
                window._dlgBaseDepth--;
                k(false)
            };
        if (n) {
            v.href = e;
            p(v, 'click', z)
        } else {
            v.parentNode.removeChild(v);
            v = null
        }
        if (o != null) {
            p(o, 'click', z)
        }
        w.style.zIndex = window._dlgBaseDepth++;
        w.style.left = 0.5 * (y - w.clientWidth) + 'px';
        A = parseInt(0.45 * (q - w.clientHeight));
        w.style.top = A + 'px';
        MData(w, 'ffixTop', A);
        if (r) {
            k()
        }
        return w
    };
    var a = {
            ICON_TYPE_SUCC: 'succ',
            ICON_TYPE_WARN: 'warn',
            ICON_TYPE_FAIL: 'fail',
            BUTTON_STYLE_ON: 'on',
            BUTTON_STYLE_OFF: 'off',
            confirm: i,
            alert: j,
            notice: f,
            popupImage: b,
            showLoading: l,
            popupCustom: d
        };
    return a
}(),

MLoading = {
    show: MDialog.showLoading,
    hide: function() {
        var b = _q("#mLoading");
        if (b) {
            b.parentNode.removeChild(b)
        }
        var a = _q("#mLoadingModal");
        if (a) {
            a.parentNode.removeChild(a)
        }
    }
};
var iTemplate = (function(){
    var template = function(){};
    template.prototype = {
        makeList: function(tpl, arr, fn){
            var res = [], $10 = [], reg = /{(.+?)}/g, json2 = {}, index = 0;
            for(var el = 0;el<arr.length;el++){
                if(typeof fn === "function"){
                    json2 = fn.call(this, el, arr[el], index++)||{};
                }
                res.push(
                     tpl.replace(reg, function($1, $2){
                        return ($2 in json2)? json2[$2]: (undefined === arr[el][$2]? '':arr[el][$2]);
                    })
                );
            }
            return res.join('');
        }
    }
    return new template();
})();


/*majinhui*/
var Util = window['Util']= {
    getUrlParams:function(){
        var href = location.href;
        var arr = href.split('?');
        var result = {};

        if(!arr[1]){
            return {};
        }
        //['aa=1','bb=2']
        var paramsArr = arr[1].split('&');
        for(var i = 0;i<paramsArr.length;i++){
            var aa = paramsArr[i].split('=');
            result[ aa[0] ] = aa[1];
        }

        return result;

    },
    substitute:function (str, obj) {
        if (!(Object.prototype.toString.call(str) === '[object String]')) {
            return '';
        }
     
        if(!(Object.prototype.toString.call(obj) === '[object Object]' && 'isPrototypeOf' in obj)) {
            return str;
        }
        //    /\{([^{}]+)\}/g
        return str.replace(/\{(.*?)\}/igm , function(match, key) {
            return obj[key] ? obj[key]:key;
        });
    }

};

var Http = window['Http'] = {
    ajax:function(data,action,opts){
        var Api = window.Api;
        var self=this,
            path,
            dfd = $.Deferred(),
            type,
            opts = opts || {};

        type = opts.type || 'get';

        if(Api[action]){
            path = ROOT+Api[action];
        }else{
            alert('action does not exsit');
            return;
        }
       
        console.log(' send data ',data,'  action ',action)
        var request = $.ajax({
            'url': path,
            'type': type,
            'data': data,
            //'timeout': 10000,
            'dataType': 'json'
        }).done(function(result) {
            console.log('ok',result,typeof result);
            if(typeof result === 'string'){
                try{
                    result = JSON.parse(result);
                }catch(err){
                    console.warn(err)
                    dfd.reject({msg:'json parse error'});
                }
            }
            
            if(result.code == 0){
                dfd.resolve(result);
            }else{
                dfd.reject({msg:'something wrong'});
            }
             

        }).fail(function(xhr){
            console.log(' xhr ',xhr)
            var error = {msg:'服务器出错了'};
            dfd.reject(error);
           
        });
       
        return dfd.promise(); 
    },
    post:function(data,url,successCallback,failCallback){
        var self = this;

        return self.ajax(data,url,{type:'post'},successCallback,failCallback);
    },
    get:function(data,url,successCallback,failCallback){
        var self = this;

        return self.ajax(data,url,{type:'get'},successCallback,failCallback);
    },
    view:function(url,successCallback,failCallback){
        var self=this,dfd = $.Deferred();

        $.ajax({
            'url': url,
            'type': 'get',
            'dataType': 'html'
        }).done(function(result) {
            dfd.resolve(result);
            successCallback && successCallback(result);

        }).fail(function(xhr){
            console.warn('获取模板'+url+'失败',xhr);
            def.reject({message:'获取模板'+url+'失败'});
            failCallback && failCallback(xhr);

        });
        return dfd.promise(); 
    },
  
    formatterError:function(xhr,action,group){
        
        
            
    }
};

var Dao = window['Dao'] = {
    getUser:function(data){
        var action = 'user.get',data = data || {};

        return Http.get(data,action);
    },
    updateUser:function(data){
        var action = 'user.update',data = data || {};

        return Http.get(data,action);
    },
    getMenuList:function(data){
        var action = 'menu.list',data = data || {};

        return Http.get(data,action);
    },
    createOrder:function(data){
        var action = 'order.create',data = data || {};

        return Http.get(data,action);
    },
    updateOrder:function(data){
        var action = 'order.update',data = data || {};

        return Http.get(data,action);
    },
    getOrderList:function(data){
        var action = 'order.list',data = data || {};

        return Http.get(data,action);
    },
    /*食物类型操作*/
    getFoodtypeList:function(data){
        var action = 'foodtype.list',data = data || {};

        return Http.get(data,action);
    },
    deleteFoodtype:function(data){
        var action = 'foodtype.delete',data = data || {};

        return Http.get(data,action);
    },
    updateFoodtype:function(data){
        var action = 'foodtype.update',data = data || {};

        return Http.get(data,action);
    },
    createFoodtype:function(data){
        var action = 'foodtype.create',data = data || {};

        return Http.get(data,action);
    },

    /*食物操作*/
    getFoodList:function(data){
        var action = 'food.list',data = data || {};

        return Http.get(data,action);
    },
    deleteFood:function(data){
        var action = 'food.delete',data = data || {};

        return Http.get(data,action);
    },
    updateFood:function(data){
        var action = 'food.update',data = data || {};

        return Http.get(data,action);
    },
    createFood:function(data){
        var action = 'food.create',data = data || {};

        return Http.get(data,action);
    },

    /*获取订单 开启状态值*/
    getOrderSwitch:function(data){
        var action = 'order.switch.get',data = data || {};

        return Http.get(data,action);
    },
    updateOrderSwitch:function(data){
        var action = 'order.switch.update',data = data || {};

        return Http.get(data,action);
    }


};
var SDialog = {
    alert:function(msg){
        MDialog.alert(null,msg,null,"确定");
    },
    confirm:function(msg,callback){
        MDialog.confirm(
            '', msg, null,
            '确定', function(){
                callback && callback();

            }, null,
            '取消', null, null,
            null, true, true
        );
    }

};
