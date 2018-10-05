define([
    'views/common/columns',
    'views/common/tickout',
    'views/common/editDogInfo',
    'views/common/constant',
], function (columns, tickout, editDog, constant) {
    var datatableId = webix.uid().toString();

    var exportData = function(){
        var win = {};
        win = getWin("导出名单", {
            rows: [{
                height: 400,
                view: "datatable",
                id: 'for_export',
                select: true,
                columns: [
                    {id: "$index", header: "NO.", width: 45},
                    {"id":"dogName","header":"犬名","width":90},
                    {"id":"chipNo","header":"芯片号","width":110},
                    {"id":"policeName","header":"带犬民警","width":80},
                    {"id":"workPlace","header":"工作单位","width":80},
                    {"id":"sex","header":"性别","width":50, template: function(obj){ return (obj.sex == 1 ? '公' : '母') ; }},
                    {"id":"birthday","header":"出生日期","width":85,"sort":"string",format: webix.Date.dateToStr("%Y-%m-%d")},
                    {"id":"breed","header":"品种","width":90,"sort":"string"},
                    {"id":"dogSource","header":"所属片区","width":60,"sort":"string"},
                    {"id":"dogColour","header":"毛色","width":75,"sort":"string"},
                    {"id":"hairType","header":"毛型","width":70,"sort":"string"},
                    {"id":"trainScore","header":"复训成绩","width":70,"sort":"string"},
                    {"id":"breeder","header":"繁殖单位","width":100,"sort":"string"},
                    {"id":"dogPros","header":"专业技能","width":100},
                    {"id":"rewardInfo","header":"立功受奖","width":85}
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
                    url: webix.proxy('customProxy','/policeDog/services/dogBaseInfo/getAll/10000/1'),
                    httpMethod: 'post',
                    datatype: 'customJson',
                    params: $$(datatableId).config.customUrl.params
                }
            },{width: 800},
                {
                    cols:[
                        {},
                        {width: 16},
                        {view: "button", label: "下载Excel", width: 65, click: function(){
                                var win = loading('正在生成');
                                setTimeout(function(){
                                    webix.toExcel($$('for_export'), {filename: '警犬列表_' + webix.Date.dateToStr("%Y%m%d%H%i%s")(new Date()) });
                                    win.close();
                                }, 10);
                            }}
                    ]
                }]
        },{width: 800, height: 500});
        win.show();
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
        checkMap = {};
        document.getElementById("checkCount").innerHTML = 0;
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

    var getArray = function(){
        var arr = [];
        for(k in checkMap){
            arr.push(checkMap[k]);
        }
        return arr;
    };

    var addWorm = function () {
        var selectedData = getArray();
        var submit = function () {
            var form = $$('tickout_form');
            if(form.validate()){
                var params = form.getValues();
                var policeName = params.policeName;
                var policeId = policeName.split("<_>")[0];
                policeName = policeName.split("<_>")[1];
                params.policeName = policeName;
                params.policeId = policeId;

                var arr = [];
                for(var i = 0; i<selectedData.length; i++){
                    var dog = selectedData[i];
                    var p = webix.copy(params);
                    p.dogId = dog.id;
                    p.dogName = dog.dogName;
                    arr.push(p);
                }

                doIPost('wormImmue/batchAddWorm', arr, function (data) {
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
                                        {view: "text", label: "警犬数量", name: "dogName", value: '已选择' + selectedData.length + '头警犬', width: 300, readonly: true},
                                        {view: "richselect", label: "完成状态", name: 'wormState', value:"2", width: 300, options:[
                                            {id: '1', value: "未完成"},
                                            {id: '2', value: "已完成"},
                                        ]},
                                        {view: "text", label: "驱虫方式", name: "wormDesc", value: '', width: 300, attributes:{ maxlength: 64 }, placeholder: '体内/体外/内服/外用'},
                                        {view: "datepicker", label: "驱虫日期", name: "wormDateStr", width: 240, format:"%Y-%m-%d", stringResult: true},
                                        {
                                            view: "richselect", label: "操作人员", name: 'policeName', id: 'policeName', width: 300,
                                            options: userList
                                        }
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

    var addImmue = function () {
        var selectedData = getArray();
        var submit = function () {
            var form = $$('tickout_form');
            if(form.validate()){
                var params = form.getValues();
                var policeName = params.policeName;
                var policeId = policeName.split("<_>")[0];
                policeName = policeName.split("<_>")[1];
                params.policeName = policeName;
                params.policeId = policeId;

                var arr = [];
                for(var i = 0; i<selectedData.length; i++){
                    var dog = selectedData[i];
                    var p = webix.copy(params);
                    p.dogId = dog.id;
                    p.dogName = dog.dogName;
                    arr.push(p);
                }

                doIPost('wormImmue/batchAddImmue', arr, function (data) {
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
            win = getWin("添加免疫记录", {
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
                                        {view: "text", label: "警犬数量", name: "dogName", value: '已选择' + selectedData.length + '头警犬', width: 300, readonly: true},
                                        {view: "richselect", label: "完成状态", name: 'immueState', value:"2", width: 300, options:[
                                            {id: '1', value: "未完成"},
                                            {id: '2', value: "已完成"}
                                        ]},
                                        {view: "text", label: "疫苗名称", name: "immueName", value: '', width: 300, attributes:{ maxlength: 64 }},
                                        {view: "datepicker", label: "免疫日期", name: "immueDateStr", width: 240, format:"%Y-%m-%d", stringResult: true},
                                        {
                                            view: "richselect", label: "操作人员", name: 'policeName', id: 'policeName', width: 300,
                                            options: userList
                                        }
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
                        rows: [{
                            cols: [
                                {view: "text", label: "带犬民警", name: "policeNameLike", width: 180, labelWidth: 70, placeholder: '支持搜索'},
                                {width: DEFAULT_PADDING},
                                {
                                    view: "richselect", label: "警犬品种", name: 'breed', width: 170, value: '-1', labelWidth: 70,
                                    options: constant.getBreedTypeOptions(true)
                                },
                                {width: DEFAULT_PADDING},
                                {view: "text", label: "警犬年龄", width: 110, labelWidth: 70, labelAlign: 'right',
                                    on: {
                                        onChange: function (newVal) {
                                            var currentYear = new Date().getFullYear();
                                            var monthDay = webix.Date.dateToStr("-%m-%d")(new Date());
                                            var startDate = (currentYear - newVal) + "-01-01";
                                            var endDate = (currentYear - newVal) + "-12-12";
                                            // var endDate = currentYear + monthDay;
                                            $$('end').setValue(startDate);
                                            if(newVal == ''){
                                                $$('end').setValue("");
                                            }
                                        }
                                    }
                                },
                                {view: "text", label: "-", width: 50, labelWidth: 10,
                                    on: {
                                        onChange: function (newVal) {
                                            var currentYear = new Date().getFullYear();
                                            var monthDay = webix.Date.dateToStr("-%m-%d")(new Date());
                                            var startDate = (currentYear - newVal) + "-01-01";
                                            var endDate = (currentYear - newVal) + "-12-12";
                                            // var endDate = currentYear + monthDay;
                                            // $$('start').setValue(startDate);
                                            $$('start').setValue(startDate);
                                            if(newVal == ''){
                                                $$('start').setValue("");
                                            }
                                        }
                                    }
                                },
                                {width: DEFAULT_PADDING},
                                {cols: [
                                    {view: "datepicker", label: "出生日期", name: "birthdayStart", id: 'start',labelWidth: 70, width: 170, format:"%Y-%m-%d", stringResult: true},
                                    {view: "datepicker", label: "-", name: "birthdayEnd", id: 'end', labelWidth: 10, width: 120, format:"%Y-%m-%d", stringResult: true},
                                    {}
                                ]} ,
                                {}
                            ]
                        },{
                            cols: [
                                {view: "text", label: "警犬名称", name: "dogNameLike", width: 180, labelWidth: 70, placeholder: '支持搜索'},
                                {width: DEFAULT_PADDING},
                                {
                                    view: "richselect", label: "工作单位", name: 'workPlace',  width: 170, value: '-1', labelWidth: 70,
                                    options: constant.getUnitOptions(true)
                                },
                                {width: DEFAULT_PADDING},
                                {view: "text", label: "警犬芯片号", name: "chipNoLike", width: 180, labelWidth: 80, placeholder: '支持搜索'},
                                {width: DEFAULT_PADDING},
                                {view: "text", label: "警犬专业", name: "mainProLike", width: 180, labelWidth: 70},
                                {width: DEFAULT_PADDING},
                                {view: "button", label: "清空", type: "form", width: 70, paddingX: 10, click: function(){
                                    $$('form').clear();
                                }},
                                {view: "button", label: "查找", type: "form", width: 70, paddingX: 10, click: search},
                                {}
                            ]
                        }]
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
                    {view: "button", label: "删除", width: 60, permission: 'dog.delete',
                        click: function () {
                            var datatable = $$(datatableId);
                            var data = datatable.getCheckedData();
                            var params = [];
                            data.each(function (item) {
                                params.push({id: item.id});
                            });
                            webix.confirm({
                                text:"确定删除？删除后不可恢复", ok:"是", cancel:"否",
                                callback:function(res){
                                    if(res){
                                        doIPost('dogBaseInfo/delete', params, function(data){
                                            if(data.success){
                                                datatable.reload();
                                                msgBox('删除成功')
                                            }else{
                                                msgBox('操作失败<br>' + data.message)
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    },
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
                                    if(item.userRole != 'SuperMan' && item.userRole != 'JuZhang' && item.userRole != 'GuanLiYuan' && item.userRole != 'FJ_JuZhang') {
                                        userList.push({id: item.id + '<_>' + item.policeName + '<_>' + item.workUnit, value: item.policeName});
                                    }
                                });
                                var win = getWin('警犬调配', {
                                    rows: [
                                        {template: '被调配警犬：#dogName#，品种：#breed#，当前带犬民警：#policeName#', data: item, height: 30, borderless: true },
                                        {
                                           cols: [
                                               {
                                                   view: "richselect", label: "请选择接收民警", id: 'policeUser', labelWidth: 115, width: 320,
                                                   options: userList
                                               },
                                               {}
                                           ]
                                        },
                                        {height: 30},
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
                                                    var par = {
                                                        dogId: item.id,
                                                        oldDogName: item.dogName,
                                                        oldPoliceId: item.policeId,
                                                        oldPoliceName: item.policeName,
                                                        newPoliceId: userInfo[0],
                                                        newPoliceName: userInfo[1],
                                                        newWorkPlace: userInfo[2]
                                                    };
                                                    console.log(par);
                                                    doIPost('dogBaseInfo/changeUser', par, function(resp){
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
                                }, {width: 500, height: 170});
                                win.show();
                            });

                        }
                    },
                    // {view: "button", label: "导出登记卡", width: 90, click: function(){
                    //     window.open('webix/警犬登记卡.doc', '_blank');
                    // }},

                    {},
                    {view: "button", label: "批量免疫", width: 80, click: addImmue, _permission: 'immue.batch.create'},
                    {view: "button", label: "批量驱虫", width: 80, click: addWorm, _permission: 'worm.batch.create'},
                    {view: "button", label: "导出数据", width: 80, click: exportData},
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
                            checkMap[item.id] = item;
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
                    params: {state: 1},//growthStage: 2
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