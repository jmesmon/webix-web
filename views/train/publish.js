define([
], function () {
    var datatableId = webix.uid().toString();

    var dateCheck = function(obj){
        if(!$$('start').getValue() ) return false;
        if(!$$('end').getValue() ) return false;
        if($$('start').getValue() > $$('end').getValue()){
            msgBox('开始日期不能大于结束日期');
            return false;
        }
        return true;
    };

    var add = function () {

        var win = {};

        var submit = function () {
            var form = $$('tickout_form');
            if (form.validate() && dateCheck()) {
                doIPost('train/setting/add', form.getValues(), function (data) {
                    if (data.success) {
                        msgBox('操作成功');
                        win.close();
                        $$(datatableId).reload();
                    } else {
                        msgBox('操作失败<br>' + data.message)
                    }
                });
            } else {
                msgBox('信息不完整信息');
            }
        };

        win = getWin("新建培训", {
            rows: [
                {
                    view:"form",
                    id: 'tickout_form',
                    elementsConfig: {
                        labelAlign: 'right',
                        labelWidth: 80
                    },
                    elements:[
                        {view: "richselect", label: "培训科目", name: 'trainName', width: 340,
                            options:[
                                {id: '追踪', value: "追踪"},
                                {id: '鉴别', value: "鉴别"},
                                {id: '物证搜索', value: "物证搜索"},
                                {id: '搜捕', value: "搜捕"},
                                {id: '治安防范', value: "治安防范"},
                                {id: '搜爆', value: "搜爆"},
                                {id: '搜毒', value: "搜毒"},
                                {id: '救援', value: "救援"},
                                {id: '其他', value: "其他"}
                            ]
                        },
                        {view: "richselect", label: "培训标准", name: 'trainLevel', width: 340,
                            options:[
                                {id: '无等级', value: "无等级"},
                                {id: '一级', value: "一级"},
                                {id: '二级', value: "二级"},
                                {id: '三级', value: "三级"}
                            ]
                        },
                        {cols: [
                            {view: "datepicker", label: "起止日期", name: "startDateStr", id: 'start', width: 200, format:"%Y-%m-%d", stringResult: true, on: { onChange: dateCheck }},
                            {view: "datepicker", label: "-", name: "endDateStr", id: 'end', labelWidth: 10, width: 140, format:"%Y-%m-%d", stringResult: true, on: { onChange: dateCheck }},
                            {}
                        ]} ,
                        // {view: "text", label: "培训单位", name: "trainUnit", width: 300, attributes:{ maxlength: 128 }},
                        {view: "richselect", label: "培训单位", name: 'trainUnit', width: 340,  value: '',
                            options:[
                                {id: '北京市公安局警犬基地', value: "北京市公安局警犬基地"},
                                {id: '公安部沈阳警犬技术学校', value: "公安部沈阳警犬技术学校"},
                                {id: '公安部南昌警犬基地', value: "公安部南昌警犬基地"},
                                {id: '公安部南京警犬基地', value: "公安部南京警犬基地"},
                                {id: '公安部昆明警犬基地', value: "公安部昆明警犬基地"}
                            ]
                        },
                        {view: "text", label: "培训地点", id: 'trainAddr', name: "trainAddr", value: '', width: 340, attributes:{ maxlength: 200 }},
                        {view: "text", label: "教员", name: 'trainUser', width: 340, attributes:{ maxlength: 64 }},
                        {view: "textarea", label: "主要内容", name: "trainDesc", width: 340, attributes:{ maxlength: 200 }}
                    ],
                    rules:{
                        "trainName":webix.rules.isNotEmpty,
                        "startDateStr":webix.rules.isNotEmpty,
                        "endDateStr":webix.rules.isNotEmpty,
                        "trainUnit":webix.rules.isNotEmpty,
                        "trainAddr":webix.rules.isNotEmpty,
                        "trainDesc":webix.rules.isNotEmpty
                    }
                },
                {width: 400},
                {
                    cols:[
                        {},
                        {view: "button", label: "取消", css: 'non-essential', width: 65, click: function () {
                            win.close();
                        }},
                        {width: DEFAULT_PADDING/2},
                        {view: "button", label: "提交", width: 65, click: submit}
                    ]
                }
            ]
        }, {height: 380});
        win.show();
    };

    var update = function () {
        var win = {};
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        if(data.length == 0){
            msgBox("请至少选择一条数据");
            return ;
        }
        var item = data[data.length-1];

        var submit = function () {
            var values = $$('tickout_form').getValues();
            console.log(values);
            var param = {
                "id": item.id,
                "trainName": values.trainName,
                "startDateStr": values.startDateStr,
                "endDateStr": values.endDateStr,
                "trainLevel": values.trainLevel,
                "trainUnit": values.trainUnit,
                "trainAddr": values.trainAddr,
                "trainUser": values.trainUser,
                "trainDesc": values.trainDesc
            };
            doPost('train/setting/update', param, function(data){
                if(data.success){
                    datatable.reload();
                    msgBox('修改成功');
                    win.close();
                }else{
                    msgBox('操作失败<br>' + data.message)
                }
            });
        };

        win = getWin("编辑培训", {
            rows: [
                {
                    view:"form",
                    id: 'tickout_form',
                    elementsConfig: {
                        labelAlign: 'right',
                        labelWidth: 80
                    },
                    elements:[
                        {view: "richselect", label: "培训科目", name: 'trainName', width: 340,  value: item.trainName,
                            options:[
                                {id: '追踪', value: "追踪"},
                                {id: '鉴别', value: "鉴别"},
                                {id: '物证搜索', value: "物证搜索"},
                                {id: '搜捕', value: "搜捕"},
                                {id: '治安防范', value: "治安防范"},
                                {id: '搜爆', value: "搜爆"},
                                {id: '搜毒', value: "搜毒"},
                                {id: '救援', value: "救援"},
                                {id: '其他', value: "其他"}
                            ]
                        },
                        {view: "richselect", label: "培训标准", name: 'trainLevel', width: 340,value: item.trainLevel,
                            options:[
                                {id: '无等级', value: "无等级"},
                                {id: '一级', value: "一级"},
                                {id: '二级', value: "二级"},
                                {id: '三级', value: "三级"}
                            ]
                        },
                        {cols: [
                            {view: "datepicker", label: "起止日期", name: "startDateStr", value: item.startDate, id: 'start', width: 200, format:"%Y-%m-%d", stringResult: true, on: { onChange: dateCheck }},
                            {view: "datepicker", label: "-", name: "endDateStr", value: item.endDate, id: 'end', labelWidth: 10, width: 140, format:"%Y-%m-%d", stringResult: true, on: { onChange: dateCheck }},
                            {}
                        ]} ,
                        {view: "richselect", label: "培训单位", name: 'trainUnit', width: 340,  value: item.trainUnit,
                            options:[
                                {id: '北京市公安局警犬基地', value: "北京市公安局警犬基地"},
                                {id: '公安部沈阳警犬技术学校', value: "公安部沈阳警犬技术学校"},
                                {id: '公安部南昌警犬基地', value: "公安部南昌警犬基地"},
                                {id: '公安部南京警犬基地', value: "公安部南京警犬基地"},
                                {id: '公安部昆明警犬基地', value: "公安部昆明警犬基地"},
                            ]
                        },
                        {view: "text", label: "培训地点", id: 'trainAddr', name: "trainAddr", value: item.trainAddr, width: 340, attributes:{ maxlength: 200 }},
                        {view: "text", label: "教员", name: 'trainUser',  value: item.trainUser, width: 340, attributes:{ maxlength: 64 }},
                        {view: "textarea", label: "主要内容", name: "trainDesc", value: item.trainDesc, width: 340, attributes:{ maxlength: 200 }}
                    ],
                    rules:{
                        "trainName":webix.rules.isNotEmpty,
                        "startDateStr":webix.rules.isNotEmpty,
                        "endDateStr":webix.rules.isNotEmpty,
                        "trainUnit":webix.rules.isNotEmpty,
                        "trainAddr":webix.rules.isNotEmpty,
                        "trainUser":webix.rules.isNotEmpty,
                        "trainDesc":webix.rules.isNotEmpty
                    }
                },
                {width: 400},
                {
                    cols:[
                        {},
                        {view: "button", label: "取消", css: 'non-essential', width: 65, click: function () {
                            win.close();
                        }},
                        {width: DEFAULT_PADDING/2},
                        {view: "button", label: "提交", width: 65, click: submit}
                    ]
                }
            ]
        }, {height: 380});
        win.show();
    };

    var del = function () {
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        if(data.length == 0){
            msgBox("请至少选择一条数据");
            return ;
        }
        console.log(data);
        webix.confirm({
            text:"确定删除？删除后报名数据也将被删除", ok:"是", cancel:"否",
            callback:function(res){
                if(res){
                    doIPost('train/setting/delete', data, function (data) {
                        if(data.success){
                            msgBox('删除成功');
                            datatable.reload();
                        }else{
                            msgBox('删除失败');
                        }
                    })
                }
            }
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
                id: 'search_from',
                elementsConfig: {
                    labelWidth: 75
                },
                elements: [
                    {
                        cols: [
                            {view: "richselect", label: "培训科目", name: 'trainName', value:"", width: 180,
                                options:[
                                    {id: '追踪', value: "追踪"},
                                    {id: '鉴别', value: "鉴别"},
                                    {id: '物证搜索', value: "物证搜索"},
                                    {id: '搜捕', value: "搜捕"},
                                    {id: '治安防范', value: "治安防范"},
                                    {id: '搜爆', value: "搜爆"},
                                    {id: '搜毒', value: "搜毒"},
                                    {id: '救援', value: "救援"},
                                    {id: '其他', value: "其他"}
                                ]
                            },
                            {width: DEFAULT_PADDING},
                            {view: "text", label: "培训单位", name: "trainUnit", width: 180},
                            {width: DEFAULT_PADDING},
                            {view: "datepicker", label: "开始日期", name: "startDateStr", width: 195, format:"%Y-%m-%d", stringResult: true},
                            {view: "datepicker", label: "-", name: "endDateStr",labelWidth: 10, width: 135, format:"%Y-%m-%d", stringResult: true},
                            {width: DEFAULT_PADDING},
                            {view: "button", label: "查找", type: "form", width: 100, paddingX: 10, click: function () {
                                var datatable = $$(datatableId);
                                var params = $$('search_from').getValues();
                                for(var n in params){
                                    if(!params[n]){
                                        delete params[n];
                                    }
                                };
                                datatable.config.customUrl.params = params;

                                datatable.reload();
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

    var gridPager = {
        rows: [
            {
                view: "form",
                css: "toolbar",
                paddingY: 5,
                paddingX: 10,
                height: 36,
                cols: [
                    {view: "button", label: "添加", width: 55, click: add},
                    {view: "button", label: "修改", width: 55, click: update},
                    {view: "button", label: "删除", width: 55, click: del},
                    {view: "button", label: "发布通知", width: 80, hidden: true, click: function () {
                        var datatable = $$(datatableId);
                        var data = datatable.getCheckedData();
                        if(data.length > 1 || data.length == 0){
                            msgBox('请选择一条培训信息，不要选择多条')
                        }else{
                            doIPost('train/sendNotice', {trainId: data[0].id}, function (resp) {
                                console.log(resp);
                            })
                        }
                    }},
                    {}
                ]
            },
            {
                id: datatableId,
                view: "datatable",
                select: false,
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
                    {id: "trainName", header: "培训科目", width: 100},
                    {id: "trainLevel", header: "培训标准", width: 100},
                    {id: "startDate", header: "开始日期", width: 130, format: webix.Date.dateToStr("%Y-%m-%d")},
                    {id: "endDate", header: "结束日期", width: 130, format: webix.Date.dateToStr("%Y-%m-%d")},
                    {id: "trainDesc", header: "培训内容", width: 200},
                    {id: "trainUnit", header: "培训单位", width: 120},
                    {id: "trainUser", header: "教员", width: 100},
                    {id: "trainAddr", header: "培训地点", fillspace: true}
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
                    url: webix.proxy('customProxy','/policeDog/services/train/setting/getList/{pageSize}/{curPage}'),
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
                        "template": "已发布的培训信息",
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