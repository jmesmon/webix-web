define([
    'views/common/columns',
    'views/common/tickout',
    'views/common/editDogInfo',
    'views/common/constant',
], function (columns, tickout, editDog, constant) {
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
        removeEmptyProperty(params, true);
        // params.growthStage = 2;
        datatable.config.customUrl.params = params;
        datatable.reload();
    };

    /**
     * 淘汰
     */
    var tickOut = function () {
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        if(data.length == 0){
            msgBox("请至少选择一条数据");
            return ;
        }
        tickout.doTickOut(data, datatable);
    };

    /**
     * 死亡
     */
    var died = function () {
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        if(data.length == 0){
            msgBox("请至少选择一条数据");
            return ;
        }
        tickout.doDied(data, datatable);
    };

    var signTrain = function () {
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        if(data.length == 0){
            msgBox("请至少选择一条数据");
            return ;
        }
        var tabid = webix.uid().toString();

        var submitSign = function () {
            var tab = $$(tabid);
            var data = tab.getCheckedData();
            console.log(data);
        };

        var win = {};


        win = getWin('报名培训', {
            rows: [
                {
                    height: 200,
                    id: tabid,
                    view: "datatable",
                    select: true,
                    columns: [
                        {
                            id: "$check",
                            header: '',
                            checkValue: 'on',
                            uncheckValue: 'off',
                            template: "{common.radio()}",
                            width: 40
                        },
                        {id: "$index", header: "NO.", width: 45},
                        {id: "trainName", header: "培训名称", width: 120},
                        {id: "startDate", header: "开始日期", width: 85, format: webix.Date.dateToStr("%Y-%m-%d")},
                        {id: "endDate", header: "结束日期", width: 85, format: webix.Date.dateToStr("%Y-%m-%d")},
                        {id: "trainDesc", header: "培训内容", width: 200},
                        {id: "trainUnit", header: "培训单位", width: 200},
                        {id: "trainAddr", header: "培训地点", minWidth: 400, fillspace: true}
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
                        datatype: 'customJson',
                        params: {
                            startDateStr: webix.Date.dateToStr("%Y-%m-%d")(new Date())
                        }
                    },
                    pager: "pagerB"
                },
                {
                    view: "pager",
                    id: "pagerB",
                    size: 5,
                    group: 5,
                    template: "{common.first()}{common.prev()}{common.pages()}{common.next()}{common.last()}<div style='float: right'>总共#count#条</div>"
                },
                {
                    cols: [{
                        template: '提醒：请从上方列表中选择一个培训项目，提交后即刻生效，可以在“警犬培训”中查看',
                        borderless: true,
                    },
                    {
                        view: "button", label: "关闭", css: 'non-essential', width: 65, click: function () {
                        win.close();
                    }
                    },
                    {width: DEFAULT_PADDING / 2},
                    {view: "button", label: "提交", width: 65, click: submitSign}
                    ]
                },{height: 5}
            ]
        }, {width: 800});
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
                            {view: "text", label: "警犬名称", name: "dogNameLike", width: 180, labelWidth: 60},
                            {width: DEFAULT_PADDING},
                            // {view: "text", label: "父犬芯片号", name: "fatherId", width: 180, labelWidth: 70},
                            // {width: DEFAULT_PADDING},
                            // {view: "text", label: "母犬芯片号", name: "motherId", width: 180, labelWidth: 70},
                            {
                                view: "richselect", label: "犬种", name: 'breed', width: 150, value: '-1', labelWidth: 40,
                                options: constant.getBreedTypeOptions(true)
                            },
                            {width: DEFAULT_PADDING},
                            {
                                view: "richselect", label: "毛色", name: 'dogColour',  width: 150, value: '-1', labelWidth: 40,
                                options: constant.getDogColorOptions(true)
                            },
                            {width: DEFAULT_PADDING},
                            {cols: [
                                {view: "datepicker", label: "出生日期", name: "birthdayStart", id: 'start',labelWidth: 60, width: 180, format:"%Y-%m-%d", stringResult: true},
                                {view: "datepicker", label: "-", name: "birthdayEnd", id: 'end', labelWidth: 10, width: 120, format:"%Y-%m-%d", stringResult: true},
                                {}
                            ]} ,
                            {width: DEFAULT_PADDING},
                            {view: "button", label: "清空", type: "form", width: 70, paddingX: 10, click: function(){
                                $$('form').clear();
                            }},
                            {view: "button", label: "查找", type: "form", width: 70, paddingX: 10, click: search},
                            {}
                        ]
                    }
                ]
            }
        ]
    };

    var cols = columns.getColumns(
        ["窝编号", "犬名", "芯片号", "芯片注入日期", "性别", "出生日期", "父亲芯片号", "母亲芯片号", "品种", "来源", "毛色", "毛型", "繁育员", "训导员" ],
        [{
            id: "id",
            header: "操作",
            template: '<div align="center"><a class="my_link edit" href="javascript:void(0)"><span class="webix_icon icon fa-pencil-square-o"></span></a></div>',
            tooltip: '编辑',
            width: 48
        }]
    );
var checkMap = {};
var checkCount = 0;
    var gridPager = {
        rows: [
            {
                view: "form",
                css: "toolbar",
                paddingY: 5,
                paddingX: 10,
                height: 36,
                cols: [
                    // {view: "button", label: "调配", width: 50},
                    // {view: "button", label: "退回", width: 50},
                    // {view: "button", label: "培训报名", width: 70, click: signTrain},
                    // {view: "button", label: "技术使用", width: 80},
                    {
                        view: "button", label: "修改信息", width: 90, permission: 'dog.edit', click: function () {
                            var datatable = $$(datatableId);
                            var data = datatable.getCheckedData();
                            if(data.length == 0){
                                msgBox('请至要修改的警犬');
                                return ;
                            }
                            editDog.openEdit(data[0], datatable);
                        }
                    },
                    {view: "button", label: "淘汰申请", width: 80, click: tickOut, permission: 'apply.tickout.create'},
                    {view: "button", label: "死亡报告", width: 80, click: died, permission: 'apply.die.create'},
                    {view: "button", label: "警犬调配", width: 80, permission: 'apply.dog.changeUser',
                        click: function(){
                            var datatable = $$(datatableId);
                            var data = datatable.getCheckedData();
                            if(data.length == 0){
                                msgBox('请至少选择一条数据');
                                return ;
                            }
                            var item = data[0];
                            doIPost('user/getList/3000/1', {}, function(resp){
                                var userList = [];
                                webix.toArray(resp.result).each(function(item){
                                    userList.push({id: item.id + '<_>' + item.policeName, value: item.policeName});
                                });
                                var win = getWin('警犬调配', {
                                    rows: [
                                        {template: '被调配警犬：#dogName#，品种：#breed#，当前带犬民警：#policeName#', data: item, height: 30, borderless: true },
                                        {
                                           cols: [
                                               {
                                                   view: "richselect", label: "请选择接收民警", id: 'policeUser', labelWidth: 95, width: 240,
                                                   options: userList
                                               },
                                               {}
                                           ]
                                        },
                                        {height: 20},
                                        {
                                            cols: [
                                                {},
                                                {view: 'button', label: '确定调配', width: 90, click: function () {
                                                    var policeUser = $$('policeUser').getValue();
                                                    if(!policeUser){
                                                        msgBox('请先选择带犬民警');
                                                        return ;
                                                    }
                                                    var userInfo = policeUser.split('<_>');
                                                    doIPost('dogBaseInfo/changeUser', {
                                                        dogId: item.id,
                                                        oldPoliceId: item.policeId,
                                                        oldPoliceName: item.policeName,
                                                        newPoliceId: userInfo[0],
                                                        newPoliceName: userInfo[1]
                                                    }, function(resp){
                                                        console.log(resp);
                                                        if(resp.success){
                                                            datatable.reload();
                                                            win.close();
                                                        }else{
                                                            msgBox('操作失败：<br>' + resp.message);
                                                        }
                                                    });
                                                }},
                                                {}
                                            ]
                                        },
                                        {}
                                    ]
                                }, {width: 400, height: 170});
                                win.show();
                            });

                        }
                    },
                    // {view: "button", label: "导出登记卡", width: 90, click: function(){
                    //     window.open('webix/警犬登记卡.doc', '_blank');
                    // }},
                    {}
                ]
            },
            {
                id: datatableId,
                view: "datatable",
                select: false,
                minHeight: 80,
                rowHeight: 120,
                datafetch: 20,//default
                tooltip:false,
                columns: columns.getDogInfo(),
                on: {
                    onBeforeLoad: function () {
                        this.showOverlay("Loading...");
                    },
                    onAfterLoad: function () {
                        this.hideOverlay();
                    },
                    onCheck: function(row, column, state){
                        var item = $$(datatableId).getItem(row);
                        if(state){
                            checkCount ++;
                            checkMap[item.chipNo] = item;
                        }else{
                            checkCount --;
                            delete checkMap[item.chipNo];
                        }
                        document.getElementById("checkCount").innerHTML = checkCount;
                    }
                },
                onClick: {
                    tab_detail: function(e, obj){
                        var item = $$(datatableId).getItem(obj.row);
                        constant.showDogDetail(item);
                    }
                },
                customUrl: {
                    // autoload: true,
                    url: webix.proxy('customProxy','/policeDog/services/dogBaseInfo/getAll/{pageSize}/{curPage}'),
                    httpMethod: 'post',
                    params: {},//growthStage: 2
                    datatype: 'customJson'
                },
                pager: "pagerA"
            },
            {
                view: "pager",
                id: "pagerA",
                size: 20,
                group: 5,
                template: "{common.first()}{common.prev()}{common.pages()}{common.next()}{common.last()}<div style='float: right'>已选择<span id='checkCount'>0</span>条&nbsp;&nbsp;&nbsp;&nbsp;总共#count#条</div>",
                on: {
                    onItemClick: function(){
                        setTimeout(function () {
                            document.getElementById("checkCount").innerHTML = checkCount;
                        }, 5);
                    }
                }
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