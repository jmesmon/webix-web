window.webix_view = {
    $init: function (config) {
        this.callEvent && this._evs_events && this.callEvent("test", []);
    },
    permission_setter: function(permission) {
        if(permissions.indexOf(permission) == -1){
                   this.hide();
            // this.disable();
        }else{
            this.show();
        }
        return permission;
    },
    getCheckedData: function(){
        var data = this.data;
        var res = [];
        if(data){
            data.getRange().each(function(val){
                if(val && val.$check){
                    res.push(val);
                }
            });
        }
        return webix.toArray(res);
    },
    reload: function() {
        var page = 0;

        var config = this.config;
        var tooltip = config.tooltip;
        if (tooltip && tooltip.hide) tooltip.hide();

        this.clearAll();

        if (this.getPager && this.getPager()) config.datafetch = this.getPager().config.size;

        var url = config.restoreUrl;
        var callback = {
            before: function () {
                if (this.setPage) this.setPage(page);
            }
        };
        var details = {
            start: config.datafetch * page,
            count: config.datafetch
        };

        if (this.getState) {
            const state = this.getState();
            details.sort = state.sort;
            if (config.hwSort && details.sort) {
                details.sort.type = config.hwSort;
            }
            details.filter = state.filter;
        }
        this.load(url, callback, details );
    },
    customUrl_setter: function (value) {
        if (value) {

            if (value.url && value.autoload !== false) {
                this.define("url", value.url);
            }

            if (value.dataFeed) {
                this.define("dataFeed", value.dataFeed);
            }

            if (value.datatype) {
                if (typeof (value.datatype) === "object") {
                    var datatype = "temp_" + webix.uid();
                    webix.DataDriver[datatype] = value.datatype;
                    value.datatype = datatype;

                    this.attachEvent("onDestruct", function () {
                        value.datatype = webix.copy(webix.DataDriver[datatype]);
                        delete webix.DataDriver[datatype];
                    });
                }
                this.define("datatype", value.datatype);
                if (this.data) {
                    this.data.driver = webix.DataDriver[value.datatype];
                }
            }
        }
        return value;
    }
};