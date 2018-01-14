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
        params.growthStage = 2;
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
        console.log(checkCount);
        if(checkCount == 0){
            msgBox("请至少选择一条数据，支持跨页选择");
            return ;
        }
        var tabid = webix.uid().toString();

        var submitSign = function () {
            var tab = $$(tabid);
            var data = tab.getCheckedData();

            if(data.length == 0){
                msgBox("请选择一条培训信息");
                return ;
            }
            data = data[0];
            var startDate = new Date(data.startDate);
            var nextTrainDate = data.startDate;
            var year = startDate.getFullYear();
            var nextYear = year + 1;
            nextTrainDate = nextTrainDate.replace(year + '', nextYear + '');

            var arr = [];
            for(var n in checkMap){
                var dog = checkMap[n];
                arr.push({
                    growStage: 2,
                    dogId: dog.id,
                    dogName: dog.dogName,
                    trainId: data.id,
                    trainName: data.trainName,
                    trainStartDateStr: data.startDate,
                    trainEndDateStr: data.endDate,
                    trainClassName: '',
                    trainLevel: '',
                    trainStage: 1,
                    trainUnit: data.trainUnit,
                    trainAddr: data.trainAddr,
                    trainUser: data.trainUser,
                    policeId: dog.policeId,
                    policeName: dog.policeName,
                    nextTrainDateStr: nextTrainDate,
                    workUnit: USER_INFO.workUnit,
                    mainTrainUser: '',
                });
            }
            console.log(arr);
            doIPost('train/add', arr, function (data) {
                win.close();
                if (data.success) {
                    $$(datatableId).reload();
                    msgBox('操作成功');
                } else {
                    msgBox('操作失败<br>' + data.message)
                }
            })
        };

        var win = {};


        win = getWin('报名培训', {
            rows: [
                {
                    height: 200,
                    id: tabid,
                    view: "datatable",
                    select: false,
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
                            {view: "text", label: "警犬名", name: "dogNameLike", width: 180, labelWidth: 50},
                            {width: DEFAULT_PADDING},
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
        [{id: "dogName", header: "犬名", width: 120}, "下次培训时间", {id: 'isSign', header: '是否报名', width: 80}, "训导员" , "性别", "出生日期", {id: "breed", header: "品种", width: 110, sort: "string"}],
        []
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
                    {view: "button", label: "报名培训", width: 90, click: signTrain},
                    {},
                ]
            },
            {
                id: datatableId,
                view: "datatable",
                select: false,
                columns: cols,
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
                    edit: function (a, b, c) {
                        console.log([a, b, c]);
                        editDog.openEdit('');
                    }
                },
                tooltip:true,
                minHeight: 80,
                datafetch: 20,//default
                customUrl: {
                    // autoload: true,
                    url: webix.proxy('customProxy','/policeDog/services/dogBaseInfo/getTrainList/{pageSize}/{curPage}'),
                    httpMethod: 'post',
                    params: {growthStage: 2, workStage: 2},
                    datatype: 'customJson'
                },
                pager: "pagerA"
            },
            {
                view: "pager",
                id: "pagerA",
                size: 20,
                group: 5,
                template: "{common.first()}{common.prev()}{common.pages()}{common.next()}{common.last()}&nbsp;&nbsp;&nbsp;&nbsp;<span style='color:#fbff00'>已选择<span id='checkCount'>0</span>条</span><div style='float: right'>总共#count#条</div>",
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