define([
], function () {
    var datatableId = webix.uid().toString();

    var doImmue = function () {
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        if(data.length == 0){
            msgBox("请至少选择一条数据");
            return ;
        }
        var w = loading();
        doPost('wormImmue/finishImmue', data, function(data){
            console.log(data);
            w.close();
            if(data.success){
                datatable.reload();
            }else{
                msgBox('操作失败<br>' + data.message)
            }
        });
    };

    var del = function(){
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        if(data.length == 0){
            msgBox("请至少选择一条数据");
            return ;
        }
        var w = loading();
        doPost('wormImmue/delImmue', data, function(data){
            w.close();
            if(data.success){
                datatable.reload();
            }else{
                msgBox('操作失败<br>' + data.message)
            }
        });
    };

    var addImmue = function () {
        var submit = function () {
            var form = $$('tickout_form');
            if(form.validate()){
                doIPost('wormImmue/addImmue', form.getValues(), function (data) {
                    console.log(data);
                    if (data.success) {
                        msgBox('操作成功，记录新增成功');
                        $$(datatableId).reload();
                        win.close();
                    } else {
                        msgBox('操作失败<br>' + data.message)
                    }
                });
            }else{
                msgBox('请填写免疫信息');
            }
        };
        var win = {};
        win = getWin("补充免疫记录", {
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
                                    {view: "text", label: "警犬窝编号", name: "nestNo", width: 300, attributes:{ maxlength: 64 }},
                                    {view: "text", label: "警犬芯片号", name: "dogId", width: 300, attributes:{ maxlength: 64 }},
                                    {view: "text", label: "疫苗名称", name: "immueDesc", value: '补充', width: 300, attributes:{ maxlength: 64 }},
                                    {view: "datepicker", label: "免疫日期", name: "immueDateStr", width: 240, format:"%Y-%m-%d", stringResult: true},
                                    {view: "text", hidden: true, name: "immueState", value: 2},
                                    {view: "text", label: "操作人员", name: "policeName", width: 300, attributes:{ maxlength: 128 }}
                                ],
                                rules:{
                                    "nestNo":webix.rules.isNotEmpty,
                                    "dogId":webix.rules.isNotEmpty,
                                    "immueDesc":webix.rules.isNotEmpty,
                                    "immueDateStr":webix.rules.isNotEmpty,
                                    "immueState":webix.rules.isNotEmpty,
                                    "policeName":webix.rules.isNotEmpty
                                }
                            }
                        ]
                    }
                },
                {width: 400},
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
        }, {height: 290});
        win.show();
    };

    var exportFile = function(){
        var win = {};
        win = getWin("导出名单", {
            rows: [{
                height: 300,
                view: "datatable",
                id: 'for_export',
                select: true,
                columns: [
                    {id: "$index", header: "NO.", width: 45},
                    {id: "dogInfo.dogName", header: "犬名", width: 90, template: function(obj){ return _.get(obj, 'dogInfo.dogName', ''); } },
                    {id: "immueDate", header: "免疫日期", width: 85, format: webix.Date.dateToStr("%Y-%m-%d")},
                    {id: "immueName", header: "疫苗名称", width: 100},
                    {id: "immueState", header: "状态", width: 55, template: function(obj, common, value){
                        if(value == 2){
                            return '已完成';
                        }else if(new Date(obj.immueDate) <= new Date()){
                            return '已超期'
                        }else{
                            return '未进行';
                        }
                    }},
                    {id: "nestNo", header: "窝编号", width: 130, sort: "string"},
                    {id: "dogInfo.chipNo", header: "芯片号", width: 90, template: function(obj){ return _.get(obj, 'dogInfo.chipNo', ''); } },
                    {id: "dogInfo.sex", header: "性别", width: 50, template: function(obj){ return ({'1': '公', '2':'母', '3': ''}[_.get(obj, 'dogInfo.sex', '3')]); } },
                    {id: "dogInfo.birthday", header: "出生日期", width: 85, sort: "string", template: function(item){
                        return webix.Date.dateToStr("%Y-%m-%d")( _.get(item, 'dogInfo.birthday', '') );
                    }},
                    {id: "dogInfo.breed", header: "品种", width: 70, sort: "string", template: function(obj){ return _.get(obj, 'dogInfo.breed', ''); } },
                    {id: "dogInfo.dogSource", header: "来源", width: 50, sort: "string", template: function(obj){ return _.get(obj, 'dogInfo.dogSource', ''); } },
                    {id: "dogInfo.dogColour", header: "毛色", width: 50, sort: "string", template: function(obj){ return _.get(obj, 'dogInfo.dogColour', ''); } },
                    {id: "dogInfo.hairType", header: "毛型", width: 50, sort: "string", template: function(obj){ return _.get(obj, 'dogInfo.hairType', '') || ''; } },
                    {id: "dogInfo.breeder", header: "繁育员", width: 80, sort: "string", template: function(obj){ return _.get(obj, 'dogInfo.breeder', ''); } }
                ],
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
                datafetch: 20,
                customUrl: {
                    url: webix.proxy('customProxy','/policeDog/services/wormImmue/list/immue/1000/1'),
                    httpMethod: 'post',
                    datatype: 'customJson',
                    params: $$(datatableId).config.customUrl.params
                }
            },
                {
                    cols:[
                        {},
                        {width: 16},
                        {view: "button", label: "下载名单", width: 65, click: function(){
                            var win = loading('正在生成');
                            setTimeout(function(){
                                webix.toExcel($$('for_export'), {filename: '免疫名单_' + webix.Date.dateToStr("%Y%m%d%H%i%s")(new Date()) });
                                win.close();
                            }, 10);
                        }}
                    ]
                }]
        },{width: 600});
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
                id: 'breed_from',
                elements: [
                    {
                        cols: [
                            {view: "text", label: "警犬芯片号", name: "dogChipNo",labelWidth: 70, width: 180},
                            {width: DEFAULT_PADDING},
                            {cols: [
                                {view: "datepicker", label: "免疫日期", name: "immueDateStart", id: 'start',labelWidth: 60, width: 180, format:"%Y-%m-%d", stringResult: true},
                                {view: "datepicker", label: "-", name: "immueDateEnd", id: 'end', labelWidth: 10, width: 120, format:"%Y-%m-%d", stringResult: true},
                                {}
                            ]} ,
                            {width: DEFAULT_PADDING},
                            {view: "richselect", label: "完成状态", name: 'immueState', value:"-1", width: 150, labelWidth: 60, options:[
                                {id: '-1', value: "全部"},
                                {id: '1', value: "未完成"},
                                {id: '2', value: "已完成"},
                                {id: '3', value: "进行中"},
                            ]},
                            {width: DEFAULT_PADDING},
                            {view: "button", label: "清空", type: "form", width: 70, paddingX: 10, click: function(){
                                $$('breed_from').clear();
                                $$('breed_from').setValues({immueState: -1});
                            }},
                            {view: "button", label: "查找", type: "form", id: 'sub_btn', width: 70, paddingX: 10, click: function(){
                                var params = $$('breed_from').getValues();
                                removeEmptyProperty(params, true);
                                var tab = $$(datatableId);
                                tab.config.customUrl.params = params;
                                tab.reload();
                            }},
                            {}
                        ]
                    }
                ]
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
                    {view: "button", label: "补充记录", width: 70, click: addImmue},
                    {view: "button", label: "完成免疫", width: 70, click: doImmue},
                    {view: "button", label: "删除", width: 70, click: del},
                    {view: "button", label: "未来7天要免疫的", width: 130, click: function () {
                        $$('breed_from').setValues({
                            immueDateEnd: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate() + 7),
                            immueState: 1
                        });
                        $$('sub_btn').config.click()
                    }},
                    {view: 'button', label: '设置当前条件下为进行中', width: 160, click: function () {
                        var params = $$(datatableId).config.customUrl.params;
                        params.immueStateSet = 3;

                        doIPost('wormImmue/updateImmueState', params, function(data){
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
                columns: [
                    {
                        id: "$check",
                        header: {content: "masterCheckbox"},
                        checkValue: 'on',
                        uncheckValue: 'off',
                        template: "{common.checkbox()}",
                        width: 40
                    },
                    {id: "$index", header: "NO.", width: 45},
                    {id: "dogInfo.dogName", header: "犬名", width: 90, template: function(obj){ return _.get(obj, 'dogInfo.dogName', ''); } },
                    {id: "immueDate", header: "免疫日期", width: 85, format: webix.Date.dateToStr("%Y-%m-%d")},
                    {id: "immueName", header: "疫苗名称", width: 100},
                    {id: "immueState", header: "状态", width: 60, template: function(obj, common, value){
                        if(value == 2){
                            return '<span class="green_color">已完成</span>';
                        }else if(value == 3){
                            return '<span class="orange_color" style="font-weight: bold;">进行中</span>'
                        }else if(new Date(obj.immueDate) <= new Date()){
                            return '<span class="red_color">已超期</span>'
                        }else{
                            return '未进行';
                        }
                    }},
                    // {id: "nestNo", header: "窝编号", width: 130, sort: "string"},
                    {id: "dogInfo.chipNo", header: "芯片号", width: 90, template: function(obj){ return _.get(obj, 'dogInfo.chipNo', ''); } },
                    {id: "dogInfo.sex", header: "性别", width: 50, template: function(obj){ return '<div align="center">' + ({'1': '公', '2':'母', '3': ''}[_.get(obj, 'dogInfo.sex', '3')]) + '</div>'; } },
                    {id: "dogInfo.birthday", header: "出生日期", width: 85, sort: "string", template: function(item){
                        return webix.Date.dateToStr("%Y-%m-%d")( _.get(item, 'dogInfo.birthday', '') );
                    }},
                    {id: "dogInfo.breed", header: "品种", width: 70, sort: "string", template: function(obj){ return _.get(obj, 'dogInfo.breed', ''); } },
                    {id: "dogInfo.dogSource", header: "来源", width: 50, sort: "string", template: function(obj){ return _.get(obj, 'dogInfo.dogSource', ''); } },
                    {id: "dogInfo.dogColour", header: "毛色", width: 50, sort: "string", template: function(obj){ return _.get(obj, 'dogInfo.dogColour', ''); } },
                    {id: "dogInfo.hairType", header: "毛型", width: 50, sort: "string", template: function(obj){ return _.get(obj, 'dogInfo.hairType', '') || ''; } },
                    {id: "dogInfo.breeder", header: "繁育员", width: 80, sort: "string", template: function(obj){ return _.get(obj, 'dogInfo.breeder', ''); } }
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
                    url: webix.proxy('customProxy','/policeDog/services/wormImmue/list/immue/{pageSize}/{curPage}'),
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