define([
    "views/common/columns",
    'views/common/constant',
], function (column, constant) {
    var datatableId = webix.uid().toString();
    /**
     * 驱虫操作
     */
    var del = function () {
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        if(data.length == 0){
            msgBox("请至少选择一条数据");
            return ;
        }
        var da = [];
        for(var i = 0; i<data.length; i++){
            da.push({id: data[i].id});
        }
        var w = loading();
        doPost('dogMating/delete', da, function(data){
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
        var params = $$('search_form').getValues();
        removeEmptyProperty(params, true);
        datatable.config.customUrl.params = params;
        datatable.reload();
    };

    var addWorm = function () {
        var win = {};
        win = getWin("添加交配信息", {
            rows: [
                {
                    view:"scrollview",
                    id:"scrollview",
                    scroll:"y",
                    height: 210,
                    body:{
                        rows:[
                            {
                                view:"form",
                                id: 'form',
                                elementsConfig: {
                                    labelAlign: 'right',
                                    labelWidth: 80
                                },
                                elements:[
                                    {
                                        cols: [
                                            {view: "text", label: "公犬名", name: 'fatherDogName', id: 'father_dog_name', width: 200,  on: constant.setDogList('father_dog_name', 'fatherDogChipNo') },
                                            {view: 'text', hidden: true, name: "fatherDogChipNo", id: 'fatherDogChipNo'},
                                            {view: "text", label: "母犬名", name: 'motherDogName', id: 'motherDogLabel', width: 200,   on: constant.setDogList('motherDogLabel', 'motherDogChipNo') },
                                            {view: 'text', hidden: true, name: "motherDogChipNo", id: 'motherDogChipNo'}
                                        ]
                                    },
                                    {
                                        cols: [
                                            {view: "datepicker", label: "交配日期", name: "mateDate", id: 'mateDate',format:"%Y-%m-%d", stringResult: true,
                                                on: {
                                                    onChange: function(newVal){
                                                        try{
                                                            var mil = newVal.getTime();
                                                            var bMuDate = new Date(mil + 1000 * 60 * 60 * 24 * 42);
                                                            bMuDate = webix.Date.dateToStr("%Y-%m-%d")(bMuDate);
                                                            $$('bMuDate').setValue(bMuDate);

                                                            var expectDate = new Date(mil + 1000 * 60 * 60 * 24 * 63);
                                                            expectDate = webix.Date.dateToStr("%Y-%m-%d")(expectDate);
                                                            $$('expectDate').setValue(expectDate);
                                                        }catch(e){}
                                                    }
                                                }
                                            },
                                            {view: "datepicker", label: "B超日期", name: "bMuDate", id: 'bMuDate', format:"%Y-%m-%d", stringResult: true}
                                        ]
                                    },

                                    {view: "datepicker", label: "预产期", name: "expectDate", id: 'expectDate', width: 200, format:"%Y-%m-%d", stringResult: true},
                                    {
                                        cols: [
                                            {view: "text", label: "产仔数量", name: "breedCount", attributes:{ maxlength: 4 }},
                                            {view: "text", label: "7日存活数", name: "liveCount7", attributes:{ maxlength: 4 }},
                                            {view: "text", label: "21日存活数", name: "liveCount21", attributes:{ maxlength: 4 }}
                                        ]
                                    },
                                    {view: "richselect", label: "当前状态", name: 'mateState', value:"1", width: 180, options:[
                                        {id: '1', value: "完成交配"},
                                        {id: '2', value: "完成B超"},
                                        {id: '3', value: "完成产仔"}
                                    ]}
                                ]
                            }
                        ]
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
                        {view: "button", label: "保存", width: 65, click: function(){
                            //
                            var values = $$('form').getValues();
                            var lod = loading('近亲校验中...');
                            doPost('dogBaseInfo/relativeCheck/'+values.fatherDogChipNo+'/' + values.motherDogChipNo, {}, function(data){
                                lod.close();
                                if(!data.success){
                                    constant.showRelative(data);
                                }else{
                                    var mateData = {
                                        fatherDogChipNo: values.fatherDogChipNo,
                                        motherDogChipNo: values.motherDogChipNo,
                                        fatherDogName: values.fatherDogName,
                                        motherDogName: values.motherDogName,
                                        mateDateStr: values.mateDate,
                                        bMuDateStr: values.bMuDate,
                                        expectDateStr: values.expectDate,
                                        breedCount: values.breedCount,
                                        liveCount7: values.liveCount7,
                                        liveCount21: values.liveCount21,
                                        mateState: values.mateState
                                    };
                                    removeEmptyProperty(mateData);
                                    doIPost('dogMating/add', [mateData], function(resp){
                                        console.log(resp);
                                        if(resp.success){
                                            msgBox('添加成功');
                                            win.close();
                                            $$(datatableId).reload();
                                        }
                                    });
                                }
                            });

                        }}
                    ]
                }
            ]
        }, {height: 310});
        win.show();
    };

    var edit = function(item){
        var win = {};
        win = getWin("修改交配信息", {
            rows: [
                {
                    view:"scrollview",
                    id:"scrollview",
                    scroll:"y",
                    height: 210,
                    body:{
                        rows:[
                            {
                                view:"form",
                                id: 'form',
                                elementsConfig: {
                                    labelAlign: 'right',
                                    labelWidth: 80
                                },
                                elements:[
                                    {view: "text", name: "id", hidden:true},
                                    {
                                        cols: [
                                            {view: "text", label: "公犬名", name: 'fatherDogName', id: 'father_dog_name', width: 200,  on: constant.setDogList('father_dog_name', 'fatherDogChipNo') },
                                            {view: 'text', hidden: true, name: "fatherDogChipNo", id: 'fatherDogChipNo'},
                                            {view: "text", label: "母犬名", name: 'motherDogName', id: 'motherDogLabel', width: 200,   on: constant.setDogList('motherDogLabel', 'motherDogChipNo') },
                                            {view: 'text', hidden: true, name: "motherDogChipNo", id: 'motherDogChipNo'}
                                        ]
                                    },
                                    {
                                        cols: [
                                            {view: "datepicker", label: "交配日期", name: "mateDate", format:"%Y-%m-%d", stringResult: true},
                                            {view: "datepicker", label: "B超日期", name: "bMuDate", format:"%Y-%m-%d", stringResult: true}
                                        ]
                                    },

                                    {view: "datepicker", label: "预产期", name: "expectDate", width: 200, format:"%Y-%m-%d", stringResult: true},
                                    {
                                        cols: [
                                            {view: "text", label: "产仔数量", name: "breedCount", attributes:{ maxlength: 4 }},
                                            {view: "text", label: "7日存活数", name: "liveCount7", attributes:{ maxlength: 4 }},
                                            {view: "text", label: "21日存活数", name: "liveCount21", attributes:{ maxlength: 4 }}
                                        ]
                                    },
                                    {view: "richselect", label: "当前状态", name: 'mateState', value:"-1", width: 180, options:[
                                        {id: '1', value: "完成交配"},
                                        {id: '2', value: "完成B超"},
                                        {id: '3', value: "完成产仔"}
                                    ]}
                                ]
                            }
                        ]
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
                        {view: "button", label: "保存", width: 65, click: function(){
                            var values = $$('form').getValues();
                            console.log(values);
                            var mateData = {
                                id: values.id,
                                fatherDogChipNo: values.fatherDogChipNo,
                                motherDogChipNo: values.motherDogChipNo,
                                mateDateStr: values.mateDate,
                                bMuDateStr: values.bMuDate,
                                expectDateStr: values.expectDate,
                                breedCount: values.breedCount,
                                liveCount7: values.liveCount7,
                                liveCount21: values.liveCount21,
                                mateState: values.mateState
                            };
                            doIPost('dogMating/update', mateData, function(resp){
                                console.log(resp);
                                if(resp.success){
                                    msgBox('修改成功');
                                    win.close();
                                    $$(datatableId).reload();
                                }
                            });
                        }}
                    ]
                }
            ]
        }, {height: 310});
        win.show();
        $$('form').setValues(item);
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
                id: 'search_form',
                elementsConfig: {
                    labelWidth: 55
                },
                elements: [
                    {
                        cols: [
                            {view: "text", label: "公犬名", name: "fatherDogName", width: 200},
                            {width: DEFAULT_PADDING},
                            {view: "text", label: "母犬名", name: "motherDogName", width: 200},
                            {width: DEFAULT_PADDING},
                            {view: "richselect", label: "状态", value:"-1", name: 'mateState', width: 180, labelWidth: 60, options:[
                                {id: '-1', value: "全部"},
                                {id: '1', value: "完成交配"},
                                {id: '2', value: "完成B超"},
                                {id: '3', value: "完成产仔"}
                            ]},
                            {width: DEFAULT_PADDING},
                            {view: "button", label: "查找", type: "form", width: 100, paddingX: 10, click: search},
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
                    {view: "button", label: "添加记录", width: 70, click: addWorm},
                    {view: "button", label: "删除", width: 70, click: del},
                    {view: "button", label: "生成幼犬信息", width: 100, click: function () {
                        var datatable = $$(datatableId);
                        console.log(datatable);
                        var data = datatable.getCheckedData();
                        if(data.length == 0){
                            msgBox('请至少选择一条数据');
                            return ;
                        }
                        window.pageParams = data[0];
                        this.$scope.show('breed.index');
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
                        checkValue: true,
                        uncheckValue: false,
                        template: "{common.checkbox()}",
                        width: 40
                    },
                    {id: "$index", header: "NO.", width: 45},
                    {
                        id: "id",
                        header: "操作",
                        template: '<div align="center"><a class="my_link edit" href="javascript:void(0)"><span class="webix_icon icon fa-pencil-square-o"></span></a></div>',
                        tooltip: '编辑',
                        width: 48
                    },
                    {id: "mateState", header: "状态", width: 65, template: function(obj, common, value){
                        return {"1": '完成交配', '2': '完成B超', '3': '已生产'}[value] || '';
                    }},
                    {id: "fatherDogName", header: "公犬名称", width: 90},
                    {id: "fatherDogChipNo", header: "公犬芯片号", width: 90},

                    {id: "fatherDogName", header: "母犬名称", width: 90},
                    {id: "motherDogChipNo", header: "母犬芯片号", width: 90},

                    {id: "mateDate", header: "交配日期", width: 85, format: webix.Date.dateToStr("%Y-%m-%d")},
                    {id: "bMuDate", header: "B超日期", width: 85, format: webix.Date.dateToStr("%Y-%m-%d")},
                    {id: "expectDate", header: "预产期", width: 85, format: webix.Date.dateToStr("%Y-%m-%d")},
                    {id: "breedCount", header: "产仔数量", width: 100},
                    {id: "liveCount7", header: "7日存活数", width: 100},
                    {id: "liveCount21", header: "21日存活数", width: 100}
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
                        var datatable = $$(datatableId);
                        var item = datatable.getItem(b.row);
                        console.log(item);
                        edit(item);
                    }
                },
                tooltip:true,
                minHeight: 80,
                datafetch: 20,//default
                customUrl: {
                    url: webix.proxy('customProxy','/policeDog/services/dogMating/getList/{pageSize}/{curPage}'),
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