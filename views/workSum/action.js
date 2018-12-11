define([
    'views/common/constant',
    'views/common/columns'
], function (constant, columnsDef) {
    var getWinForm = function (workType, title, formId, onSubmit) {
       // 搜爆安检：出勤次数、出勤人数、出勤犬数、安检面积（千平米）、安检车辆数、查获违禁品数（件）、查获毒品（克）
       // 治安防范：巡逻次数、出勤人数、出勤犬数、巡逻时长（单位：小时）、查获违禁品数（件）、查获毒品（克）
       // 其他（备勤）：备勤次数、出勤人数、出勤犬数、备勤时长（单位：小时）、查获违禁品数（件）、查获毒品（克）
       // 刑侦侦查：出勤次数、出勤人数、出勤犬数、破案数、查获违禁品数（件）、查获毒品（克）
        var staetAndEndDate =
            {
                cols: [
                    {view: "datepicker", label: "出勤日期", name: "dateStart",labelWidth: 100, width: 220, format:"%Y-%m-%d", stringResult: true},
                    {view: "datepicker", label: "-", name: "dateEnd", labelWidth: 15, width: 135, format:"%Y-%m-%d", stringResult: true},
                ]
            };
        var workType_Field = {
            "搜爆安检": [
                staetAndEndDate,
                {view: "text", label: "出勤次数", name: 'attQty', value:""},
                {view: "text", label: "出勤人数", name: 'attPerQty', value:""},
                {view: "text", label: "出勤犬数", name: 'attDogQty', value:""},
                {
                    cols: [
                        {view: "text", label: "安检面积", name: 'checkArea', value:""},
                        {template: '平米', borderless: 1}
                    ]
                },
                {view: "text", label: "安检车辆数", name: 'checkCarQty', value:""}
            ],
            "治安防范": [
                staetAndEndDate,
                {view: "text", label: "巡逻次数", name: 'attQty', value:""},
                {view: "text", label: "出勤人数", name: 'attPerQty', value:""},
                {view: "text", label: "出勤犬数", name: 'attDogQty', value:""},
                {
                    cols: [
                        {view: "text", label: "巡逻时长", name: 'workHours', value:""},
                        {template: '小时', borderless: 1}
                    ]
                }
            ],
            "其他（备勤）": [
                staetAndEndDate,
                {view: "text", label: "备勤次数", name: 'attQty', value:""},
                {view: "text", label: "出勤人数", name: 'attPerQty', value:""},
                {view: "text", label: "出勤犬数", name: 'attDogQty', value:""},
                {
                    cols: [
                        {view: "text", label: "备勤时长", name: 'workHours', value:""},
                        {template: '小时', borderless: 1}
                    ]
                }
            ],
            "刑侦侦查": [
                staetAndEndDate,
                {view: "text", label: "出勤次数", name: 'attQty', value:""},
                {view: "text", label: "出勤人数", name: 'attPerQty', value:""},
                {view: "text", label: "出勤犬数", name: 'attDogQty', value:""},
                {view: "text", label: "破案数", name: 'paQty', value:""}
            ],
        };
        var field = workType_Field[workType] || [];
        field.push({
            cols: [
                {view: "text", label: "查获违禁品数", name: 'wjpQty', value:""},
                {template: '件', borderless: 1}
            ]
        });
        field.push({
            cols: [
                {view: "text", label: "查获毒品数", name: 'dpQty', value:"" },
                {template: '克', borderless: 1}
            ]
        });
        field.push({view: "text", hidden: true, name: 'id'});
        field.push({view: "text", hidden: true, name: 'workType', value: workType});

        var win = getWin(title, {
            rows: [
                {template: '<span style="color:#FFF900">请按周录入工作量汇总</span>', borderless: 1, height: 30},
                {
                    view:"scrollview",
                    scroll:"y",
                    height: 335,
                    body:{
                        rows:[
                            {
                                view:"form",
                                id: formId,
                                elementsConfig: {
                                    labelAlign: 'right',
                                    labelWidth: 100,
                                    width: 400
                                },
                                elements: field
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
                        {view: "button", label: "提交", width: 65, click: onSubmit}
                    ]
                }
            ]
        }, {height: 450});
        return win;
    };

    var columnBatchMapping = {"搜爆安检": 'sbaj', "治安防范": 'zaff', "其他（备勤）": 'bq', "刑侦侦查": 'xzzc' };

    var action = {
        getActions: function(datatableId, formId){
            var self = {
                doSearch: function () {
                    var datatable = $$(datatableId);
                    var params = $$(formId).getValues();
                    removeEmptyProperty(params);
                    params.workUnit = USER_INFO.workUnit;
                    if(params.workUnitFilter == -1){
                        delete params.workUnitFilter;
                    }
                    datatable.config.customUrl.params = params;
                    var workType = params.workType;
                    datatable.showColumnBatch(columnBatchMapping[workType]);
                    datatable.reload();
                },
                reload: function (workType) {
                    $$(formId).setValues({workType: workType});
                    self.doSearch();
                },
                delete: function(){
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
                                doIPost('work/deleteWorkSum', params, function(data){
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
                },
                add: function (workType) {
                    console.log(workType);
                    var win = getWinForm(workType, '添加【' + workType + '】工作数据', 'add_work_sum', function () {
                        var params = $$('add_work_sum').getValues();
                        params.workUnit = USER_INFO.workUnit;
                        removeEmptyProperty(params);
                        console.log(params);
                        doIPost('work/addWorkSum', [params], function (data) {
                            if (data.success) {
                                console.log(datatableId);
                                self.reload(params.workType);
                                win.close();
                            } else {
                                msgBox('操作失败<br>' + data.message)
                            }
                        });
                    });
                    win.show();
                },
                update: function (a, b, c) {
                    var item = $$(datatableId).getItem(b.row);
                    console.log(item);
                    var formId = 'update_work_sum';
                    var win = getWinForm(item.workType, '修改', formId, function () {
                        var params = $$(formId).getValues();
                        console.log(params);
                        doIPost('work/updateWorkSum', params, function (data) {
                            console.log(data);
                            if (data.success) {
                                self.reload(params.workType);
                                win.close();
                            } else {
                                msgBox('操作失败<br>' + data.message)
                            }
                        });
                    });
                    win.show();
                    $$(formId).setValues(item);
                },
            };
            return self;
        }
    };

    return action;
})