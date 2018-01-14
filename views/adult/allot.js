define([
    'views/common/columns',
    'views/common/tickout',
    'views/common/editDogInfo',
    'views/common/constant',
], function (columns, tickout, editDog, constant) {

    var cols = columns.getColumns(
        ["犬名", "性别", "出生日期", "品种","毛色", "训导员" ]
    );
    var datatableId1 = webix.uid().toString();
    var datatableId2 = webix.uid().toString();

    function loadData (tableid, params) {
        if(params.growthStage == 0){
            delete params.growthStage;
        }
        var datatable = $$(tableid);
        removeEmptyProperty(params, true);
        datatable.config.customUrl.params = params;
        datatable.reload();
    };
    var selectedData = [];
    var applyData = null;

    return {
        $ui: {
            cols: [
                {
                    rows: [
                        {
                            height: 40,
                            cols: [{width: 20},{
                                rows: [
                                    {height: 8},
                                    {
                                        view: "richselect", label: "调出方单位", id: 'unit1', name: "caseNo", width: 240,
                                        options:constant.getUnitOptions(),
                                        on: {
                                            onChange: function (newVal, oldVal) {
                                                loadData(datatableId1, {workPlace: $$('unit1').getValue(), growthStage: $$('child_1').getValue() });
                                            }
                                        }
                                    },{}
                                ]
                            }, {width: 20}, {
                                view:"checkbox",
                                id:"child_1",
                                label:"只看幼犬",
                                labelWidth: 60,
                                value:0,
                                on: {
                                    onChange: function (newVal, oldVal) {
                                        loadData(datatableId1, {growthStage: $$('child_1').getValue() });
                                    }
                                }
                            },{}]
                        },
                        {
                            id: datatableId1,
                            view: "datatable",
                            datafetch: 15,//default
                            tooltip: false,
                            columns: cols,
                            on: {
                                onBeforeLoad: function () {
                                    this.showOverlay("Loading...");
                                },
                                onAfterLoad: function () {
                                    this.hideOverlay();
                                }
                            },
                            customUrl: {
                                url: webix.proxy('customProxy','/policeDog/services/dogBaseInfo/getAll/{pageSize}/{curPage}'),
                                httpMethod: 'post',
                                params: {workPlace: '刑侦总队'},
                                datatype: 'customJson'
                            },
                            pager: "pagerC"
                        },
                        {
                            view: "pager",
                            id: "pagerC",
                            size: 15,
                            group: 5,
                            template: "{common.first()}{common.prev()}{common.pages()}{common.next()}{common.last()}<div style='float: right'>&nbsp;&nbsp;&nbsp;&nbsp;总共#count#条</div>",
                        }
                    ]
                },
                {
                    rows: [
                        {},
                        {view: "button", label: "调配>>", width: 50, click: function () {
                            var rec = $$('unit2').getValue();
                            if(rec.length == 0){
                                msgBox('请选择接收方单位');
                                return ;
                            }

                            var data = $$(datatableId1).getCheckedData();
                            console.log(data);
                            var idArr = [];
                            for(var i = 0; i<data.length; i++){
                                var item = webix.copy(data[i]);
                                idArr.push(item.id);
                                item.workPlace = rec;
                                selectedData.push(item);
                                item.$index = 'new ' + item.$index;
                                item.tutor='待分配';
                                $$(datatableId2).add(item);
                            }
                            $$(datatableId1).remove(idArr);
                            console.log(idArr);

                            // table.setPage( parseInt((count + size - 1) / size) );
                        }},
                        {view: "button", label: "还原", width: 50, click: function () {
                            $$(datatableId1).reload();
                            // $$(datatableId2).reload();
                            selectedData = [];
                        }},
                        {}
                    ]
                },
                {
                    rows: [
                        {
                            height: 40,
                            cols: [{width: 20},{
                                rows: [
                                    {height: 8},
                                    {
                                        view: "richselect", label: "接收方单位", id: 'unit2', name: "caseNo", width: 240,
                                        options:constant.getUnitOptions(),
                                        on: {
                                            onChange: function (newVal, oldVal) {
                                                // loadData(datatableId2, {workPlace: $$('unit2').getValue() });
                                            }
                                        }
                                    },{}
                                ]
                            },{}]
                        },
                        {
                            id: datatableId2,
                            view: "datatable",
                            datafetch: 15,//default
                            tooltip: false,
                            columns: cols,
                            on: {
                                onBeforeLoad: function () {
                                    this.showOverlay("Loading...");
                                },
                                onAfterLoad: function () {
                                    this.hideOverlay();
                                },
                            },
                            data: []
                            // customUrl: {
                            //     url: webix.proxy('customProxy','/policeDog/services/dogBaseInfo/getAll/{pageSize}/{curPage}'),
                            //     httpMethod: 'post',
                            //     params: {},
                            //     datatype: 'customJson'
                            // },
                            // pager: "pagerB"
                        },
                        {
                            height: 25,
                            cols: [{},{
                                rows: [{view: "button", label: "保存", width: 65, click: function () {
                                    console.log(selectedData);
                                    doIPost('dogBaseInfo/allot', selectedData, function(data){
                                        if(data.success){
                                            msgBox('操作成功');
                                            //applyData
                                            if(applyData) {
                                                applyData.applyState = 4;
                                                doIPost('/apply/dog/update', applyData, function (da) {
                                                    if (da.success) {
                                                        msgBox('申请单状态变更成功');
                                                    } else {
                                                        msgBox('申请单状态变更失败');
                                                    }
                                                })
                                            }
                                        }else{
                                            msgBox('操作失败');
                                        }
                                    })
                                }}]
                            },{}]
                        },
                        {
                            height: 60,
                            template: '<div style="margin-top: -10px">说明：<br>1、警犬调配：调配范围是在分局之间调动，不可以调配到带犬人员。<br>2、调配到分局后，分局可以通过“警犬管理”->“警犬列表”中的“更换训导员”按钮，更换带犬人员</div>', borderless: true
                        }
                    ]
                }
            ]
        },
        $oninit: function(){
            $$('unit1').setValue('刑侦总队');

            var _allot_ = sessionStorage.getItem("_allot_");
            console.log(_allot_);
            if(_allot_ && _allot_.length > 0) {
                sessionStorage.removeItem("_allot_");
                var allotApply = JSON.parse(_allot_);
                applyData = allotApply;
                $$('unit2').setValue(allotApply.workUnit);
                $$('unit2').config.readonly = true;
                $$('unit2').refresh();
            }
        }
    };
});