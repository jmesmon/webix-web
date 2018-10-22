define([
    'views/common/constant',
    'views/common/columns'
], function (constant, columnsDef) {
    var getWinForm = function (title, formId, onSubmit) {
        var win = getWin("添加", {
            rows: [
                {
                    view:"scrollview",
                    scroll:"y",
                    height: 410,
                    body:{
                        rows:[
                            {
                                view:"form",
                                id: formId,
                                elementsConfig: {
                                    labelAlign: 'right',
                                    labelWidth: 70
                                },
                                elements:[
                                    {view: "text", name: 'id', value:"", hidden: true},
                                    {view: "text", label: "犬名", name: 'dogName', value:"", width: 300},
                                    {view: "richselect", label: "品种", name: 'breed', value:"", width: 300, options: constant.breedType},
                                    {view: "richselect", label: "毛型", name: 'hairType', value:"", width: 300, options: constant.hairType},
                                    {view: "richselect", label: "毛色", name: 'dogColor', value:"", width: 300, options: constant.dogColor},
                                    {view: "richselect", label: "性别", name: 'sex', value:"", width: 300, options: ["公", "母"]},
                                    {view: "text", label: "带犬人", name: "owner", value: '', width: 300, attributes:{ maxlength: 64 }},
                                    {view: "text", label: "带犬单位", name: "workUnit", value: '', width: 300, attributes:{ maxlength: 64 }},
                                    {view: "datepicker", label: "分配日期", name: "allotDate", width: 240, format:"%Y-%m-%d", stringResult: true},
                                    {view: "textarea", label: "其他备注", name: "remark", value: '', width: 500,  height: 100, attributes:{ maxlength: 200 },placeholder: '仅限200字'},
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
                        {view: "button", label: "提交", width: 65, click: onSubmit}
                    ]
                }
            ]
        }, {height: 500});
        return win;
    };

    var action = {
        init: function (formId, datatableId) {
            return {
                doSearch: function () {
                    var datatable = $$(datatableId);
                    datatable.config.customUrl.params = $$(formId).getValues();
                    datatable.reload();
                },
                add: function () {
                    var formId = 'add_allot_info';
                    var win = getWinForm('添加', formId, function () {
                        var params = $$(formId).getValues();
                        console.log(params);
                        doIPost('alot/list/add', params, function (data) {
                            if (data.success) {
                                msgBox('操作成功，记录新增成功');
                                console.log(datatableId);
                                $$(datatableId).reload();
                                win.close();
                            } else {
                                msgBox('操作失败<br>' + data.message)
                            }
                        });
                    });
                    win.show();
                },
                update: function (a, b, c) {
                    var formId = 'add_allot_info';
                    var win = getWinForm('修改', formId, function () {
                        var params = $$(formId).getValues();
                        console.log(params);
                        doIPost('alot/list/add', params, function (data) {
                            console.log(data);
                            if (data.success) {
                                msgBox('操作成功，记录新增成功');
                                $$(datatableId).reload();
                                win.close();
                            } else {
                                msgBox('操作失败<br>' + data.message)
                            }
                        });
                    });
                    win.show();
                    var item = $$(datatableId).getItem(b.row);
                    console.log(item);
                    $$(formId).setValues(item);
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
                                doIPost('alot/list/delete', params, function(data){
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
            }
        }
    };

    return action;
})