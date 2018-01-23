function msgBox(msg){
    webix.message({type: 'alert', text: '<div style="padding: 0 16px">' + msg + '</div>' });
}
var DEFAULT_PADDING = 10;

webix.i18n.parseFormat = "%Y-%m-%d";
webix.i18n.setLocale();
webix.DataDriver.customJson = webix.extend({
    toObject: function (_data) {
        var data = webix.DataDriver.json.toObject(_data);
        return data;
    },
    getRecords: function (_data) {
        var pageSize = _data.pageVO.pageSize;
        var curPage = _data.pageVO.curPage;

        var data = _data;
        if (data.result) {
            data = data.result;
        }
        if (data && !webix.isArray(data)) return data = [data];
        for(var i = 0; i<data.length; i++){
            data[i].$index = i + 1 + pageSize * (curPage - 1)
        }
        return data;
    },
    getDetails: function (data) {
        return data;
    },
    getInfo: function (data) {
        var pageInfo = data.pageVO;

        var _info = {};
        if (!pageInfo) {
            _info = {
                config: data.config
            };
        } else {
            var count = pageInfo.totalRows;
            var hasMore = false;
            _info = {
                total_count: count,
                pos: pageInfo.pageSize * (pageInfo.curPage - 1),
                parent: null,
                config: data.config,
                webix_security: null
            };

            if (hasMore) {
                _info.config = {
                    hasMore: true
                };
            }
        }
        return webix.DataDriver.json.getInfo(_info);
    }
}, webix.DataDriver.json);

var customProxy = {
    $proxy:true,
    load:function(view, callback, details){
        const config = view.config;
        const customUrl = config.customUrl;
        const params = this.params || customUrl.params || {a: 1};
        const httpMethod = customUrl.httpMethod || 'GET';
        const timeout = customUrl.timeout || 60000;
        const headers = customUrl.headers || {};

        var from = view.count();

        var count = config.datafetch || view.count();
        const totalRows = -1;
        const pageSize = count;

        if (details) {
            from = details.start;
            if (count >= 0) count = details.count;
        }

        const curPage = Math.floor(from / count) + 1;

        var url = customUrl.url.source;
        url = url.replace("{curPage}", curPage.toString())
            .replace("{pageSize}", pageSize.toString())
            .replace("{totalRows}", totalRows.toString());

        config.restoreUrl = 'customProxy->' + url;

        var paramsJson = JSON.stringify(params);
        if(httpMethod === 'get'){
            if (!!window.ActiveXObject || "ActiveXObject" in window) {
                var key = "date" + new Date().getTime();
                params[key] = key;
            }
            if (typeof (params) == 'object' && Object.keys(params).length === 0) {
                paramsJson = "";
            }
            paramsJson = '';
        }
        var mycallback = [{
            error: function(text, data, loader) {
                msgBox('数据加载异常，状态码：' + loader.status);
                view.callEvent("onAfterLoad", []);
            },
            success: function(text, data, loader) {
                webix.ajax.$callback(view, callback, text, data, loader);
            }
        }];
        headers['Content-Type'] = 'application/json';
        webix.ajax().headers(headers).timeout(timeout)[httpMethod](url, paramsJson, mycallback, this);
    },
    save:function(view, update, dp, callback){
        webix.ajax().post(url, update, callback);
    },
    result:function(state, view, dp, text, data, loader){
        dp.processResult(state, data, details);
    }
};
webix.proxy.customProxy = webix.extend(webix.proxy, {
    customProxy: customProxy
}).customProxy;

function doIPost(url, params, success, fail){
    var lodWin = loading();

    url = '/policeDog/services/' + url;
    var promise = webix.ajax().headers({'Content-Type':  'application/json'}).post(url, JSON.stringify(params));
    promise.then(function (response) {
        success && success(response.json());
        lodWin.close();
    });
    promise.fail(function (err) {
        fail && fail(err);
        lodWin.close();
        msgBox("请求出错，请稍后再试");
    });
    return lodWin;
}
function doPost(url, params, success, fail){
    url = '/policeDog/services/' + url;
    var promise = webix.ajax().headers({'Content-Type':  'application/json'}).post(url, JSON.stringify(params));
    if(success) {
        promise.then(function (response) {
            success(response.json());
        });
    }
    fail = fail || function () {
        try{
            for(var n in window._LOADING){
                try{
                    window._LOADING[n].close();
                }catch (e){}
            }
        }catch(e){}

        // msgBox("请求出错，请稍后再试")
    };
    promise.fail(function (err) {
        fail(err);
    });
}

function getWin(title, ui, config){
    var cfg = config || {};
    var width = cfg.width || 600;
    console.log(width);
    var height = cfg.height || 400;
    var win_id = webix.uid().toString();
    var modal = true;
    if('N' == config.modal){
        modal = false;
    }

    var win = webix.ui({
        view: "window",
        id: win_id,
        width: width,
        height: height,
        move: true,
        modal: modal,
        position: "center",
        autofocus: true,
        head: {
            view: "toolbar",
            cols: [{
                view: "label",
                label: title
            },{
                view: "icon",
                icon: "close",
                tooltip: "关闭",
                click: function () {
                    $$(win_id).close();
                }
            }]
        },
        body: {
            padding: 10,
            rows: [
                ui
            ]
        }
    });
    return win;
}

//        var webixAjaxCallback = webix.ajax.$callback;
//        webix.ajax.$callback = function(owner, call, text, data, x, is_error) {
//            webixAjaxCallback(owner, call, text, data, x, is_error);
//        }
window._LOADING = [];
function loading(msg, timeout){
    timeout = timeout || 60 * 1000;
    msg = msg || '处理中，请稍后';

    var win_id = webix.uid().toString();
    var win = webix.ui({
        view: "window",
        id: win_id,
        width: 300,
        height: 100,
        move: true,
        modal: true,
        position: "center",
        css: 'non_header',
        autofocus: true,
        header: {
            hidden: true
        },
        body: {
            rows: [{
                template: '<div align="center"><img src="assets/imgs/loading.gif" height="45px" width="45px"><br>' + msg + '</div>'
            }]
        }
    });
    win.show();
    _LOADING.push(win);
    setTimeout(function(){
        win.close();
    }, timeout);
    return win;
}

function removeEmptyProperty(obj, remove_1){
    for(var k in obj){
        var v = obj[k] + '';
        if(v.length == 0 || (remove_1 && v == '-1')){
            delete obj[k];
        }
    }
}

function getBase(){
    webix.ajax().sync().post('/policeDog/services/user/base', {}, function(result){
        var data = JSON.parse(result);
        if(data.success){
            console.log(data);
            USER_INFO = data.result;
            sessionStorage.setItem("_user_info_", JSON.stringify(data.result));
        }else{
            console.log('not login');
            window.open('login/login.html', '_self');
        }
    })
}
getBase();