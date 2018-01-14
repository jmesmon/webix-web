define([
], function () {
    var datatableId = webix.uid().toString();

    var del = function(){
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        if(data.length == 0){
            msgBox("请至少选择一条数据");
            return ;
        };

        webix.confirm({
            text:"确定删除？删除不可恢复", ok:"是", cancel:"否",
            callback:function(res){
                if(res){
                    var w = loading();
                    doPost('apply/die/delete', data, function(data){
                        w.close();
                        if(data.success){
                            datatable.reload();
                        }else{
                            msgBox('操作失败<br>' + data.message)
                        }
                    });
                }
            }
        });
    };

    var add = function () {
        var submit = function () {
            var form = $$('tickout_form');
            if(form.validate()){
                doIPost('/apply/dog/add', form.getValues(), function (data) {
                    if (data.success) {
                        msgBox('操作成功');
                        $$(datatableId).reload();
                        win.close();
                    } else {
                        msgBox('操作失败<br>' + data.message)
                    }
                });
            }else{
                msgBox('请填写申请信息');
            }
        };
        var win = {};
        win = getWin("申请警犬", {
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
                                    {view: "text", hidden: true, name: "applyState", width: 300, value: 1},
                                    {view: "text", label: "数量", name: "applyAmount", width: 300, attributes:{ maxlength: 3 }},
                                    {view: "textarea", label: "备注", name: "applyDesc", width: 300, attributes:{ maxlength: 128 }, height: 100, value: '用途：\r\n期望犬种：\n期望颜色：\n期望配发日期：\n其他：'},
                                ],
                                rules:{
                                    "applyDesc":webix.rules.isNotEmpty,
                                    "applyAmount":webix.rules.isNotEmpty,
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

    var update = function (item) {
        var submit = function () {
            var form = $$('update_form');
            if(form.validate()){
                doIPost('/apply/dog/update', form.getValues(), function (data) {
                    if (data.success) {
                        msgBox('操作成功');
                        $$(datatableId).reload();
                        win.close();
                    } else {
                        msgBox('操作失败<br>' + data.message)
                    }
                });
            }else{
                msgBox('请填写申请信息');
            }
        };
        var win = {};
        win = getWin("修改申请信息", {
            rows: [
                {
                    view:"scrollview",
                    scroll:"y",
                    height: 200,
                    body:{
                        rows:[
                            {
                                view:"form",
                                id: 'update_form',
                                elementsConfig: {
                                    labelAlign: 'right',
                                    labelWidth: 70
                                },
                                elements:[
                                    {view: "text", hidden: true, name: "id", width: 300, value: item.id},
                                    {view: "text", hidden: true, name: "applyState", width: 300, value: 1},
                                    {view: "text", label: "数量", name: "applyAmount", width: 300, attributes:{ maxlength: 3 },value: item.applyAmount},
                                    {view: "textarea", label: "备注", name: "applyDesc", width: 300, attributes:{ maxlength: 128 }, height: 100, value: item.applyDesc},
                                ],
                                rules:{
                                    "applyDesc":webix.rules.isNotEmpty,
                                    "applyAmount":webix.rules.isNotEmpty
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

    var approve = function (isFinal) {
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        if(data.length == 0){
            msgBox("请至少选择一条数据");
            return ;
        }

        var options = [
            {id: '2', value: "通过"},
            {id: '4', value: "驳回"}
        ];
        if(isFinal){
            options = [
                {id: '3', value: "终审通过"},
                {id: '4', value: "驳回"}
            ];
        }
        var da = [];
        if(!isFinal){
            for(var i = 0; i<data.length; i++){
                console.log(data[i]);
                if(data[i].applyState == 1){
                    da.push(data[i]);
                }else{
                    webix.message('编号为：' + data[i].id + ' 的申请，当前状态不是局长审批，跳过该记录')
                }
            }
        }
        data = da;
        if(data.length == 0){
            msgBox("请至少选择一条数据");
            return ;
        }
        var win = getWin("批量审批", {
            rows: [{
                height: 30,
                borderless: true,
                template: '一共选择了'+data.length+'条申请，请审批'
            }, {
                view: "richselect", label: "审批结果", id: 'applyState', width: 200, value: '2', labelWidth: 60,
                options: options
            },
                {view: "text", label: "审批意见", name: "approveDetail", id: 'approveDetail', labelWidth: 60, width: 280},
                {width: 400},
                {
                    cols:[
                        {},
                        {view: "button", label: "取消", css: 'non-essential', width: 65, click: function () {
                            win.close();
                        }},
                        {width: DEFAULT_PADDING/2},
                        {view: "button", label: "提交", width: 65, click: function () {
                            var da = [];
                            var applyState = $$('applyState').getValue();
                            var approveDetail = $$('approveDetail').getValue();
                            for(var i = 0; i<data.length; i++){
                                if(isFinal){
                                    da.push({
                                        id: data[i].id,
                                        dogId: data[i].dogId,
                                        applyState: applyState,
                                        applyDateStr: webix.Date.dateToStr("%Y-%m-%d")(new Date()) ,
                                        approveDetail: approveDetail,
                                        approver: USER_INFO.policeName + '/' + USER_INFO.policeId
                                    });
                                }else{
                                    da.push({
                                        id: data[i].id,
                                        dogId: data[i].dogId,
                                        applyState: applyState,
                                        unitApproveDateStr: webix.Date.dateToStr("%Y-%m-%d")(new Date()) ,
                                        unitApproveDetail: approveDetail,
                                        unit_approver: USER_INFO.policeName + '/' + USER_INFO.policeId
                                    });
                                }
                            }
                            doIPost('apply/die/update', da, function(res){
                                win.close();
                                if(res.success){
                                    $$(datatableId).reload();
                                }else{
                                    msgBox('操作失败<br>' + res.message)
                                }
                            });
                        }}
                    ]
                }]
        }, {width: 400, height: 160});
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
                            // {view: "text", label: "申请单位", name: "workUnit",labelWidth: 60, width: 220},
                            // {width: DEFAULT_PADDING},
                            {view: "richselect", label: "申请状态", name: 'applyState', value:"-1", width: 200, labelWidth: 60, options:[
                                {id: '-1', value: "全部"},
                                {id: '1', value: "待分局审批"}, //1：带审批，2：审批通过，带配发，3：申请驳回，4：配发完成
                                {id: '2', value: "待九支队审批"},
                                {id: '3', value: "审批完成"},
                                {id: '4', value: "申请驳回"},
                            ]},
                            {width: DEFAULT_PADDING},
                            {view: "button", label: "清空", type: "form", width: 70, paddingX: 10, click: function(){
                                $$('breed_from').clear();
                                $$('breed_from').setValues({immueState: -1});
                            }},
                            {view: "button", label: "查找", type: "form", width: 70, paddingX: 10, click: function(){
                                var params = $$('breed_from').getValues();
                                removeEmptyProperty(params, true);
                                console.log(params);
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
                    {view: "button", label: "分局审批", width: 70, click: function () {
                        approve(false);
                    }, permission: 'apply.die.approve'},
                    {view: "button", label: "九支队终审", width: 90, click: function () {
                        approve(true);
                    }, permission: 'apply.die.approve.final'},
                    // {view: "button", label: "删除", width: 70, click: del},
                    {},
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
                    {id: "applyUnit", header: "申请单位", width: 80, sort: "string"},
                    {id: "applyState", header: "审批状态", width: 100, template: function(obj, common, value){
                        return {
                            "1": "待分局审批",
                            "2": "待九支队审批",
                            "3": "审批完成",
                            "4": "申请驳回"}[value] || "";
                    }},
                    {id: "dogInfo", header: "警犬名称", width: 100, sort: "string", template: '#dogInfo.dogName#'},
                    {id: "dogInfo", header: "警犬芯片号", width: 100, sort: "string", template: '#dogInfo.chipNo#'},
                    {id: "applyDate", header: "申请日期", width: 90, format: webix.Date.dateToStr("%Y-%m-%d") },
                    {id: "sickReason", header: "病因", width: 150, sort: "string"},
                    {id: "sickDate", header: "生病日期", width: 90, format: webix.Date.dateToStr("%Y-%m-%d") },
                    {id: "cureDetail", header: "救治情况", width: 150, sort: "string"},
                    {id: "dieDate", header: "死亡日期", width: 90, format: webix.Date.dateToStr("%Y-%m-%d") },
                    {id: "dieReason", header: "死亡原因", width: 100, sort: "string"},
                    {id: "conclus", header: "结论", width: 150, sort: "string"},
                    {id: "photos", header: "附件", width: 50, sort: "string"},

                    {id: "unitApproveDate", header: "分局日期", width: 85, format: webix.Date.dateToStr("%Y-%m-%d")},
                    {id: "unitApproveDetail", header: "分局审批意见", width: 150},
                    {id: "approveDate", header: "九支队审批日期", width: 85, format: webix.Date.dateToStr("%Y-%m-%d")},
                    {id: "approveDetail", header: "九支队审批意见", width: 150},
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
                    edit: function (ev, obj) {
                        var datatable = $$(datatableId);
                        var item = datatable.getItem(obj.row);
                        console.log(item);
                        update(item);
                    },
                    showDetail: function (ev, obj, el) {
                        var datatable = $$(datatableId);
                        var item = datatable.getItem(obj.row);
                        if(item.approveDetail){
                            var detail = JSON.parse(item.approveDetail);
                            if(detail.length > 0){

                            }else{
                                msgBox('暂无审批')
                            }
                        }else{
                            msgBox('暂无审批')
                        }
                    }
                },
                tooltip:true,
                minHeight: 80,
                datafetch: 20,//default
                customUrl: {
                    url: webix.proxy('customProxy','/policeDog/services/apply/die/getList/{pageSize}/{curPage}'),
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