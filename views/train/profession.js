define([
    "views/common/columns"
], function (column) {
    var datatableId = webix.uid().toString();

    var del = function(){
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        if(data.length == 0){
            msgBox("请至少选择一条数据");
            return ;
        }
        webix.confirm({
            text:"确定删除？删除不可恢复", ok:"是", cancel:"否",
            callback:function(res){
                if(res){
                    var w = loading();
                    doPost('profession/delete', data, function(data){
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

    var setScore = function () {
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        if(data.length == 0){
            msgBox("请至少选择一条数据");
            return ;
        }
        var win = getWin("批量设置成绩", {
            rows: [{
                height: 30,
                borderless: true,
                template: '一共选择了'+data.length+'只警犬，请设置培训成绩'
            }, {
                view: "richselect", label: "培训成绩", id: 'trainResult', width: 200, value: '合格', labelWidth: 60,
                options: [
                    {id: '合格', value: "合格"},
                    {id: '优秀', value: "优秀"},
                    {id: '不合格', value: "不合格"},
                ]
            },
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
                        var trainResult = $$('trainResult').getValue();
                        for(var i = 0; i<data.length; i++){
                            da.push({id: data[i].id, trainResult: trainResult});
                        }
                        doIPost('train/batchUpdate', da, function(res){
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

    /**
     * 执行搜索
     */
    var search = function () {
        var datatable = $$(datatableId);
        var params = $$('form').getValues();
        datatable.config.customUrl.params = params;
        datatable.reload();
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
                            {view: "text", label: "窝编号", name: "nestNo", width: 300, labelWidth: 60},
                            {width: DEFAULT_PADDING},
                            {view: "richselect", label: "完成状态", value:"-1", width: 180, labelWidth: 60, options:[
                                {id: '-1', value: "全部"},
                                {id: '2', value: "未完成"},
                                {id: '1', value: "已完成"}
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

    var cols = column.getColumns([//"类型",
         "培训科目", "开始日期", "结束日期", "培训单位", "犬名_2", "芯片号_2", "教员", "带犬民警", "培训成绩", "下次培训时间", "培训地点"
    ], []);

    var gridPager = {
        rows: [
            {
                view: "form",
                css: "toolbar",
                paddingY: 5,
                paddingX: 10,
                height: 36,
                cols: [
                    // {view: "button", label: "添加", width: 70},
                    {view: "button", label: "删除", width: 70, permission: 'train.prof.btn.del', click: del},
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
                    {id: "", header: "警犬名称", width: 130, template: function(obj){ return obj.dogInfo.dogName || ''; } },
                    {id: "", header: "警犬芯片号", width: 130, template: function(obj){ return obj.dogInfo.chipNo || ''; } },
                    {id: "profName", header: "专业名称", width: 130},
                    {id: "creationDate", header: "获取日期", width: 85, format: webix.Date.dateToStr("%Y-%m-%d")},
                    {fillspace: 1},
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