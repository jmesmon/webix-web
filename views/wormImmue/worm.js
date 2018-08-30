define([
    "views/common/columns",
    'views/common/constant',
], function (column, constant) {
    var datatableId = webix.uid().toString();
    /**
     * 驱虫操作
     */
    var doWorm = function () {
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        if(data.length == 0){
            msgBox("请至少选择一条数据");
            return ;
        }
        var w = loading();
        doPost('wormImmue/finishWorm', data, function(data){
            console.log(data);
            w.close();
            if(data.success){
                datatable.reload();
            }else{
                msgBox('操作失败<br>' + data.message)
            }
        });
    };

    /**
     * 执行搜索
     */
    var search = function () {
        var datatable = $$(datatableId);
        var params = $$('form').getValues();
        datatable.config.customUrl.params = params;
        datatable.reload();
    };

    var del = function(){
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        if(data.length == 0){
            msgBox("请至少选择一条数据");
            return ;
        }
        var w = loading();
        doPost('wormImmue/delWorm', data, function(data){
            w.close();
            if(data.success){
                datatable.reload();
            }else{
                msgBox('操作失败<br>' + data.message)
            }
        });
    };

    var addWorm = function () {
        var submit = function () {
            var form = $$('tickout_form');
            if(form.validate()){
                var params = form.getValues();
                var policeName = params.policeName;
                var policeId = policeName.split("<_>")[0];
                policeName = policeName.split("<_>")[1];
                params.policeName = policeName;
                params.policeId = policeId;

                doIPost('wormImmue/addWorm', params, function (data) {
                    console.log(data);
                    if (data.success) {
                        msgBox('操作成功，新增成功');
                        $$(datatableId).reload();
                        win.close();
                    } else {
                        msgBox('操作失败<br>' + data.message)
                    }
                });
            }else{
                msgBox('请填写驱虫信息');
            }

        };
        var win = {};
        doIPost('user/getListByRole/3000/1', {userRole: 'FanZhiRenYuan'}, function(resp) {
            var userList = [];
            webix.toArray(resp.result).each(function (item) {
                if (item.userRole != 'SuperMan' && item.userRole != 'JuZhang' && item.userRole != 'GuanLiYuan' && item.userRole != 'FJ_JuZhang') {
                    userList.push({
                        id: item.id + '<_>' + item.policeName,
                        value: item.policeName
                    });
                }
            });
            win = getWin("添加驱虫记录", {
                rows: [
                    {
                        view:"scrollview",
                        id:"scrollview",
                        scroll:"y",
                        height: 200,
                        body:{
                            rows:[
                                {
                                    view:"form",
                                    id: 'tickout_form',
                                    elementsConfig: {
                                        labelAlign: 'right',
                                        labelWidth: 70
                                    },
                                    elements:[
                                        {view: "text", name: "dogId", id: 'dog_id', hidden: true},
                                        {view: "text", label: "警犬名称", name: "dogName", id: 'dog_name', width: 300, readonly: true, placeholder: '点击选择',
                                            on: {
                                                onItemClick: function () {
                                                    constant.setDog('dog_name', 'dog_id', {});
                                                }
                                            }
                                        },
                                        {view: "richselect", label: "完成状态", name: 'wormState', value:"2", width: 300, options:[
                                            {id: '1', value: "未完成"},
                                            {id: '2', value: "已完成"},
                                        ]},
                                        {view: "text", label: "驱虫方式", name: "wormDesc", value: '', width: 300, attributes:{ maxlength: 64 }, placeholder: '体内/体外/内服/外用'},
                                        {view: "datepicker", label: "驱虫日期", name: "wormDateStr", width: 240, format:"%Y-%m-%d", stringResult: true},
                                        {
                                            view: "richselect", label: "操作人员", name: 'policeName', id: 'policeName', width: 300,
                                            options: userList
                                        },
                                        // {view: "text", label: "操作人员", name: "policeName", width: 300, attributes:{ maxlength: 128 }}
                                    ],
                                    rules:{
                                    }
                                }
                            ]
                        }
                    },
                    {width: 600},
                    {
                        cols:[
                            {},
                            {view: "button", label: "取消", css: 'non-essential', width: 65, click: function () {
                                win.close();
                            }},
                            {width: DEFAULT_PADDING/2},
                            {view: "button", label: "提交保存", width: 65, click: submit}
                        ]
                    }
                ]
            }, {height: 290});
            win.show();
        });

    };

    var searchForm = {
        type: "clean",
        rows: [
            {
                view: "toolbar",
                css: "highlighted_header header1",
                paddingX: 5,
                paddingY: 5,
                height: 35,
                cols: [{
                    "template": "查找",
                    "css": "sub_title2",
                    borderless: true
                }]
            },
            {
                view: "form",
                id: 'form',
                elementsConfig: {
                    labelWidth: 90
                },
                elements: [
                    {
                        cols: [
                            {view: "text", labelWidth: 70, width: 180, name: "dogNameLike", label: '警犬名称', placeholder: '支持模糊查询'},
                            // {view: "text", name: "dogId", id: 'dog_id2', hidden: true},
                            // {view: "text", label: "警犬名称", id: 'dog_name2', labelWidth: 70, width: 180, readonly: true, placeholder: '点击选择',
                            //     on: {
                            //         onItemClick: function () {
                            //             constant.setDog('dog_name2', 'dog_id2', {});
                            //         }
                            //     }
                            // },
                            {width: DEFAULT_PADDING},
                            {cols: [
                                {view: "datepicker", label: "驱虫日期", name: "wormDateStart", id: 'start',labelWidth: 70, width: 180, format:"%Y-%m-%d", stringResult: true},
                                {view: "datepicker", label: "-", name: "wormDateEnd", id: 'end', labelWidth: 10, width: 120, format:"%Y-%m-%d", stringResult: true},
                                {}
                            ]} ,
                            {width: DEFAULT_PADDING},
                            {view: "richselect", label: "完成状态", name: 'wormState', value:"-1", width: 150, labelWidth: 70, options:[
                                {id: '-1', value: "全部"},
                                {id: '1', value: "未完成"},
                                {id: '2', value: "已完成"}
                            ]},
                            {width: DEFAULT_PADDING},
                            {view: "button", label: "清空", type: "form", width: 70, paddingX: 10, click: function(){
                                $$('form').clear();
                                $$('form').setValues({wormState: -1});
                            }},
                            {view: "button", label: "查找", type: "form", id: 'sub_btn', width: 70, paddingX: 10, click: function(){
                                var params = $$('form').getValues();
                                removeEmptyProperty(params, true);
                                var tab = $$(datatableId);
                                tab.config.customUrl.params = params;
                                tab.reload();
                            }},
                            {}
                        ]
                    }
                ],
                rules:{
                    "father":webix.rules.isNotEmpty,
                    "mother":webix.rules.isNotEmpty
                }
            }
        ]
    };

    var columns = [
        {
            id: "$check",
            header: {content: "masterCheckbox"},
            checkValue: true,
            uncheckValue: false,
            template: "{common.checkbox()}",
            width: 40
        },
        {id: "$index", header: "NO.", width: 45},
        {id: "dogInfo.dogName", header: "犬名", width: 200, template: function(obj){ return _.get(obj, 'dogInfo.dogName','') ; } },
        {id: "wormDate", header: "驱虫日期", width: 108, format: webix.Date.dateToStr("%Y-%m-%d")},
        {id: "wormDesc", header: "驱虫方式/周期", width: 140},
        {id: "wormState", header: "状态", width: 65, template: function(obj, common, value){
            if(value == 2){
                return '<span class="green_color">已完成</span>';
            }else if(value == 3){
                return '<span class="orange_color" style="font-weight: bold;">进行中</span>'
            }else if(new Date(obj.wormDate) <= new Date()){
                return '<span class="red_color">已超期</span>'
            }else{
                return '未进行';
            }
        }},
        {id: "dogInfo.sex", header: "性别", width: 60, template: function(obj){ return '<div align="center">' + ({'1': '公', '2':'母', '3': ''}[_.get(obj, 'dogInfo.sex', '3')]) + '</div>'; } },
        {id: "dogInfo.birthday", header: "出生日期", width: 100, sort: "string", template: function(item){
            return webix.Date.dateToStr("%Y-%m-%d")( _.get(item, 'dogInfo.birthday', '') );
        }},
        {id: "dogInfo.breed", header: "品种", width: 120, sort: "string", template: function(obj){ return _.get(obj, 'dogInfo.breed', ''); } },
        {id: "dogInfo.dogColour", header: "毛色", width: 100, sort: "string", template: function(obj){ return _.get(obj, 'dogInfo.dogColour', ''); } },
        {id: "dogInfo.policeName", header: "带犬人员", width: 100, sort: "string", template: function(obj){ return _.get(obj, 'dogInfo.policeName', '') || ''; } }
    ];

    var column2 = [
        {id: "$index", header: "NO.", width: 45},
        {id: "dogInfo.dogName", header: "犬名", width: 90, template: function(obj){ return _.get(obj, 'dogInfo.dogName','') ; } },
        {id: "wormDate", header: "驱虫日期", width: 85, format: webix.Date.dateToStr("%Y-%m-%d")},
        {id: "wormDesc", header: "驱虫方式/周期", width: 100},
        {id: "wormState", header: "状态", width: 55, template: function(obj, common, value){
            if(value == 2){
                return '已完成';
            }else if(value == 3){
                return '进行中'
            }else if(new Date(obj.wormDate) <= new Date()){
                return '已超期'
            }else{
                return '未进行';
            }
        }},
        {id: "dogInfo.sex", header: "性别", width: 50, template: function(obj){ return ({'1': '公', '2':'母', '3': ''}[_.get(obj, 'dogInfo.sex', '3')]); } },
        {id: "dogInfo.birthday", header: "出生日期", width: 85, sort: "string", template: function(item){
            return webix.Date.dateToStr("%Y-%m-%d")( _.get(item, 'dogInfo.birthday', '') );
        }},
        {id: "dogInfo.breed", header: "品种", width: 70, sort: "string", template: function(obj){ return _.get(obj, 'dogInfo.breed', ''); } },
        {id: "dogInfo.dogSource", header: "来源", width: 50, sort: "string", template: function(obj){ return _.get(obj, 'dogInfo.dogSource', ''); } },
        {id: "dogInfo.dogColour", header: "毛色", width: 50, sort: "string", template: function(obj){ return _.get(obj, 'dogInfo.dogColour', ''); } },
        {id: "dogInfo.hairType", header: "毛型", width: 50, sort: "string", template: function(obj){ return _.get(obj, 'dogInfo.hairType', '') || ''; } },
        {id: "dogInfo.policeName", header: "带犬人员", width: 100, sort: "string", template: function(obj){ return _.get(obj, 'dogInfo.policeName', '') || ''; } }
    ];

    var exportFile = function(){
        var win = {};
        win = getWin("导出名单", {
            rows: [{
                height: 400,
                view: "datatable",
                id: 'for_export',
                select: true,
                columns: column2,
                on: {
                    onBeforeLoad: function () {
                        this.showOverlay("Loading...");
                    },
                    onAfterLoad: function () {
                        this.hideOverlay();
                    }
                },
                tooltip:true,
                minHeight: 80,
                datafetch: 20,//default
                customUrl: {
                    url: webix.proxy('customProxy','/policeDog/services/wormImmue/list/worm/10000/1'),
                    httpMethod: 'post',
                    datatype: 'customJson',
                    params: $$(datatableId).config.customUrl.params || {}
                }
            },{width: 800},
            {
                cols:[
                    {},
                    {view: "button", label: "下载Excel", width: 65, click: function(){
                        var win = loading('正在生成');
                        webix.toExcel($$('for_export'), {filename: '驱虫信息_' + webix.Date.dateToStr("%Y%m%d%H%i%s")(new Date()) });
                        win.close();
                    }}
                ]
            }]
        },{width: 800, height: 500});
        win.show();
    };

    var gridPager = {
        rows: [
            {
                view: "form",
                css: "toolbar",
                paddingY: 5,
                paddingX: 10,
                height: 36,
                cols: [
                    {view: "button", label: "添加", width: 70, click: addWorm},
                    {view: "button", label: "完成驱虫", width: 70, click: doWorm}, //, permission: 'worm.finishWorm'
                    {view: "button", label: "删除", width: 70, permission: 'worm.del', click: del},
                    {view: "button", label: "未来7天要驱虫的", width: 130, permission: 'worm.next7DWorm', click: function () {
                        $$('form').setValues({
                            wormDateEnd: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate() + 7),
                            wormState: 1
                        });
                        $$('sub_btn').config.click()
                    }},
                    {view: 'button', label: '设置当前条件下为进行中', width: 160, permission: 'worm.next7DWorm', click: function () {
                        var params = $$(datatableId).config.customUrl.params;
                        params.wormStateSet = 3;

                        doIPost('wormImmue/updateWormState', params, function(data){
                            if(data.success){
                                msgBox('设置成功');
                            }else{
                                msgBox('操作失败，请稍后再试');
                            }
                        });
                    }},
                    {},
                    {view: "button", label: "导出名单", width: 70, click: exportFile},
                ]
            },
            {
                id: datatableId,
                view: "datatable",
                select: true,
                columns: columns,
                on: {
                    onBeforeLoad: function () {
                        this.showOverlay("Loading...");
                    },
                    onAfterLoad: function () {
                        this.hideOverlay();
                    }
                },
                onClick: {
                    edit: function (a, b, c) {
                        console.log([a, b, c]);
                    },
                    webix_icon: function (e, id) {
                        webix.confirm({
                            text: "Are you sure sdfds", ok: "Yes", cancel: "Cancel",
                            callback: function (res) {
                                if (res) {
                                    webix.$$("orderData").remove(id);
                                }
                            }
                        });
                    }
                },
                tooltip:true,
                minHeight: 80,
                datafetch: 20,//default
                customUrl: {
                    url: webix.proxy('customProxy','/policeDog/services/wormImmue/list/worm/{pageSize}/{curPage}'),
                    httpMethod: 'post',
                    datatype: 'customJson'
                },
                pager: "pagerA"
            },
            {
                view: "pager",
                id: "pagerA",
                size: 20,
                group: 5,
                template: "{common.first()}{common.prev()}{common.pages()}{common.next()}{common.last()}<div style='float: right'>总共#count#条</div>"
            }
        ]
    };


    var datatable = {
        type: "clean",
        rows: [
            {
                view: "toolbar",
                css: "highlighted_header header1",
                paddingX: 5,
                paddingY: 5,
                height: 35,
                cols: [
                    {
                        "template": "结果",
                        "css": "sub_title2",
                        borderless: true
                    }
                ]
            },
            gridPager
        ]
    };

    return {
        $ui: {
            type: "space",
            // type: "wide",
            rows: [
                {rows: [searchForm, datatable]}
            ]
        }
    };
});