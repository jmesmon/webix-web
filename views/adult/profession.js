define([
    "views/common/columns"
], function (column) {
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

    var addWorm = function () {
        var submit = function () {
            var form = $$('tickout_form');
            if(form.validate()){
                // doIPost('dogBaseInfo/tickout', data, function (data) {
                //     if (data.success) {
                //         datatable.reload();
                msgBox('操作成功，记录新增成功');
                win.close();
                // } else {
                //     msgBox('操作失败<br>' + data.message)
                // }
                // });
            }else{
                msgBox('请填写驱虫信息');
            }

        };
        var win = {};
        win = getWin("添加警犬专业", {
            rows: [
                {
                    rows:[
                        {
                            view:"form",
                            id: 'tickout_form',
                            elementsConfig: {
                                labelAlign: 'right',
                                labelWidth: 70
                            },
                            elements:[
                                {view: "text", label: "警犬芯片号", name: "dogId", width: 280, attributes:{ maxlength: 64 }},
                                {view: "richselect", label: "技能信息", value:"-1", width: 280, options:[
                                    {id: '-1', value: "全部"},
                                    {id: '6', value: "鉴别"},
                                    {id: '5', value: "追踪"},
                                    {id: '8', value: "血迹搜索"},
                                    {id: '1', value: "爬墙"},
                                    {id: '2', value: "搜爆"},
                                    {id: '3', value: "搜毒"},
                                    {id: '7', value: "搜捕"},
                                    {id: '5', value: "刑侦"}
                                ]},
                                {view: "datepicker", label: "获得日期", name: "wormDateStr", width: 180, format:"%Y-%m-%d", stringResult: true},
                            ],
                            rules:{
                            }
                        }
                    ]
                },
                {width: 10},
                {
                    cols:[
                        {},
                        {view: "button", label: "取消申请", css: 'non-essential', width: 65, click: function () {
                            win.close();
                        }},
                        {width: DEFAULT_PADDING/2},
                        {view: "button", label: "提交申请", width: 65, click: submit}
                    ]
                }
            ]
        }, {height: 210});
        win.show();
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
                            {view: "text", label: "警犬芯片号", name: "father", width: 300},
                            {width: DEFAULT_PADDING},
                            {view: "richselect", label: "技能信息", value:"-1", width: 180, labelWidth: 60, options:[
                                {id: '-1', value: "全部"},
                                {id: '6', value: "鉴别"},
                                {id: '5', value: "追踪"},
                                {id: '8', value: "血迹搜索"},
                                {id: '1', value: "爬墙"},
                                {id: '2', value: "搜爆"},
                                {id: '3', value: "搜毒"},
                                {id: '7', value: "搜捕"},
                                {id: '5', value: "刑侦"}
                            ]},
                            {width: DEFAULT_PADDING},
                            {view: "button", label: "查找幼犬", type: "form", width: 100, paddingX: 10, click: search},
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

    var gridPager = {
        rows: [
            {
                view: "form",
                css: "toolbar",
                paddingY: 5,
                paddingX: 10,
                height: 36,
                cols: [
                    {view: "button", label: "添加专业", width: 70, click: addWorm},
                    {view: "button", label: "删除专业", width: 70, click: doWorm},
                    {}
                ]
            },
            {
                id: datatableId,
                view: "datatable",
                select: true,
                columns: [
                    {
                        id: "$check",
                        header: {content: "masterCheckbox"},
                        checkValue: true,
                        uncheckValue: false,
                        template: "{common.checkbox()}",
                        width: 40
                    },
                    {id: "$index", header: "NO.", width: 45},
                    {id: "dogInfo.dogName", header: "犬名", width: 90, template: function(obj){ return obj.dogInfo.dogName || ''; } },
                    {id: "profName", header: "专业名称", width: 100},
                    {id: "creationDate", header: "获得日期", width: 85, format: webix.Date.dateToStr("%Y-%m-%d")},
                    {id: "dogInfo.chipNo", header: "芯片号", width: 110, template: function(obj){ return obj.dogInfo.chipNo || ''; } },
                    {id: "dogInfo.chipNoInject", header: "芯片注入日期", width: 90, template: function(item){
                        return webix.Date.dateToStr("%Y-%m-%d")(item.dogInfo.chipNoInject);
                    }},
                    {id: "dogInfo.sex", header: "性别", width: 50, template: function(obj){ return '<div align="center">' + (obj.dogInfo.sex == 1 ? '公' : '母') + '</div>'; } },
                    {id: "dogInfo.birthday", header: "出生日期", width: 85, sort: "string", template: function(item){
                        return webix.Date.dateToStr("%Y-%m-%d")(item.dogInfo.birthday);
                    }},
                    {id: "dogInfo.breed", header: "品种", width: 90, sort: "string", template: function(obj){ return obj.dogInfo.breed || ''; } },
                    {id: "dogInfo.dogSource", header: "来源", width: 60, sort: "string", template: function(obj){ return obj.dogInfo.dogSource || ''; } },
                    {id: "dogInfo.dogColour", header: "毛色", width: 80, sort: "string", template: function(obj){ return obj.dogInfo.dogColour || ''; } },
                    {id: "dogInfo.hairType", header: "毛型", width: 70, sort: "string", template: function(obj){ return obj.dogInfo.hairType || ''; } },
                    {id: "dogInfo.tutor", header: "训导员", width: 100, sort: "string", template: function(obj){ return obj.dogInfo.tutor || ''; } },
                    {width: 1}
                ],
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
                    url: webix.proxy('customProxy','/policeDog/services/profession/getList/{pageSize}/{curPage}'),
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