define([
    "views/common/constant"
], function (constant) {

    return {
        $ui: {
            type: "space",
            css: 'addDog',
            view:"scrollview",
            scroll:"y",
            body:{
                type: "space",
                rows:[
                {
                    view:"fieldset", label:"警犬基本信息",
                    body:{
                        rows: [
                            {
                                view: "form",
                                id: 'baseInfoForm',
                                elementsConfig: {
                                    labelAlign: 'right',
                                    labelWidth: 70
                                },
                                elements: [
                                    {
                                        cols: [{
                                            width: 300,
                                            rows: [
                                                {view: "text", label: "警犬名称", name: "dogName", format:"%Y-%m-%d", stringResult: true, on: {
                                                    onChange: function(newVal, oldVal){
                                                        var input = this;
                                                        if(newVal == ''){
                                                            return ;
                                                        }
                                                        doIPost('dogBaseInfo/isNameDump', {dogName: newVal}, function (data) {
                                                            if(!data.success){
                                                                msgBox("您输入的警犬名称已经存在，不允许重名，请重新修改");
                                                                input.setValue(oldVal || '');
                                                            }
                                                        })
                                                    }
                                                }},
                                                {view: "text", label: "芯片编号", name: "chipNo", attributes:{ maxlength: 128 }},
                                                // {view: "datepicker", label: "注入日期", name: "chipNoInjectStr", format:"%Y-%m-%d", stringResult: true},
                                                {view: "richselect", label: "性别", value:"1", name: 'sex', options:[
                                                    {id: '1', value: "公犬"},
                                                    {id: '2', value: "母犬"}
                                                ]},
                                                {view: "datepicker", label: "出生日期", name: "birthdayStr", format:"%Y-%m-%d", stringResult: true},
                                                {view: "text", label: "繁殖单位", name: "breeder", disabled: false},
                                                {view: "text", label: "训导员", name: "tutor", disabled: false, hidden: true},
                                                {template: "<div style='line-height: 4px'>带犬民警：&nbsp;请先创建警犬信息，然后在分配带犬人员</div>", height: 20, borderless: true },

                                            ]
                                        }, {
                                            width: DEFAULT_PADDING * 2
                                        }, {
                                            width: 300,
                                            rows: [
                                                {view: "richselect", label: "成长阶段", name: 'growthStage', value:"2", options: constant.getGrowthStage(), hidden: true},
                                                {view: "richselect", label: "品种", name: 'breed', value:"-1", options: constant.getBreedTypeOptions(), on: {
                                                    onChange: function(newVal){
                                                        var def = constant.getDefaultTypeColor(newVal);
                                                        if(def) {
                                                            $$('dogPhoto').setValue(def.photo);
                                                            $$('dogColor').setValue(def.dogColor);
                                                            $$('hairType').setValue(def.hairType);
                                                        }else{
                                                            $$('dogPhoto').setValue('');
                                                            $$('dogColor').setValue('');
                                                            $$('hairType').setValue('');
                                                        }
                                                    }
                                                } },
                                                {view: "richselect", label: "来源", name: 'dogSource', value:"-1", options: constant.getDogSourceOptions() },
                                                {view: "richselect", label: "毛色", id: 'dogColor', name: 'dogColour', value:"-1", options: constant.getDogColorOptions() },
                                                {view: "richselect", label: "毛型", id: 'hairType', name: 'hairType', value:"-1", options: constant.getHairTypeOptions() },
                                                {view: "richselect", label: "工作类型", name: 'dogType', value:"1", options: constant.getWorkType() },
                                                {view: "multiselect", label: "专业方向", name: 'dogPro', options: constant.getDogPro() },
                                                {view: "richselect", label: "犬种等级", name: 'dogLevel', value:"", options: constant.getDogLevel(), hidden: true },
                                                {view: "richselect", label: "犬种等级", id: 'dogPhoto', name: 'dogPhoto', value:"", options: constant.getDogLevel(), hidden: true },
                                            ]
                                        }, {
                                            width: DEFAULT_PADDING * 2
                                        }, {
                                            width: 300,
                                            rows: [
                                                {view: "richselect", label: "工作状态", name: 'workStage', value:"2", options: constant.getWorkStage()},
                                                {view: "text", label: "警犬档案号", name: "fileNo", disabled: false},
                                                {view: "richselect", label: "复训成绩", name: "trainScore", options: [
                                                    {id: '不合格', value: "不合格"},
                                                    {id: '合格', value: "合格"},
                                                    {id: '优秀', value: "优秀"}
                                                ]},
                                                {view: "richselect", label: "工作单位", name: "workPlace", options: constant.getUnitOptions(), value: USER_INFO.workUnit, readonly: (USER_INFO.workUnit != 'JiuZhiDui')},
                                                {view: "richselect", label: "所属片区", name: "workArea", options: constant.getDogArea() }

                                            ]
                                        },{}
                                    ]
                                    },{
                                        cols: [{view: "textarea", label: "立功受奖", name: "rewardInfo", width: 975 },{}]
                                    }
                                ]
                            },
                            {}
                        ]
                    }
                },
                {
                    view:"fieldset", label:"驱虫/疫苗信息",
                    body: {
                        rows: [
                            {
                                view: "datatable",
                                select: true,
                                id: 'wormImmueData',
                                height: 120,
                                columns: [
                                    {
                                        id: "$check",
                                        header: {content: "masterCheckbox"},
                                        checkValue: 'on',
                                        uncheckValue: 'off',
                                        template: "{common.checkbox()}",
                                        width: 40
                                    },
                                    {
                                        id: "id",
                                        header: "操作",
                                        template: '<div align="center"><a class="my_link remove" href="javascript:void(0)"><span class="webix_icon icon fa-remove"></span></a></div>',
                                        tooltip: '删除',
                                        width: 48
                                    },
                                    {id: "type", header: "类别", width: 100},
                                    {id: "date", header: "完成日期", width: 100, format: webix.Date.dateToStr("%Y-%m-%d")},
                                    {id: "name", header: "名称", fillspace: 1},
                                ],
                                tooltip:true,
                                minHeight: 80,
                                datafetch: 20,//default
                                data: [],
                                onClick: {
                                    remove: function (ev, obj) {
                                        var datatable = $$('wormImmueData');
                                        var item = datatable.getItem(obj.row);
                                        datatable.remove(item.id);
                                    }
                                }
                            },
                            {
                                view: "form",
                                id: 'immueForm',
                                elementsConfig: {
                                    labelAlign: 'right',
                                    labelWidth: 70
                                },
                                elements: [
                                    {
                                        cols: [
                                            {view: "richselect", label: "类别", value:"驱虫操作", name: 'type', width: 250, labelWidth: 40, options:[
                                                {id: '驱虫操作', value: "驱虫"},
                                                {id: '疫苗接种', value: "免疫"}
                                            ]},
                                            {view: "datepicker", label: "完成日期", name: "date", width: 200, format:"%Y-%m-%d", stringResult: true},
                                            {view: "text", label: "驱虫/免疫", name: "name"},
                                            {view: "button", label: "新增一条", width: 70, click: function () {
                                                var fom = $$('immueForm');
                                                var values = fom.getValues();
                                                if(!values.date){
                                                    msgBox("请填写完成日期");
                                                    return ;
                                                }
                                                if(!values.name){
                                                    msgBox("请填写驱虫周期，或者免疫疫苗信息");
                                                    return ;
                                                }
                                                $$('wormImmueData').add( fom.getValues() );
                                                fom.clear();
                                            }},
                                            {},
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    view:"fieldset", label:"培训信息",
                    body:{
                        rows: [
                            {
                                view: "datatable",
                                select: true,
                                id: 'trainData',
                                height: 120,
                                columns: [
                                    {
                                        id: "$check",
                                        header: {content: "masterCheckbox"},
                                        checkValue: 'on',
                                        uncheckValue: 'off',
                                        template: "{common.checkbox()}",
                                        width: 40
                                    },
                                    {
                                        id: "id",
                                        header: "操作",
                                        template: '<div align="center"><a class="my_link remove" href="javascript:void(0)"><span class="webix_icon icon fa-remove"></span></a></div>',
                                        tooltip: '删除',
                                        width: 48
                                    },
                                    {id: "trainStartDateStr", header: "开始日期", width: 100, format: webix.Date.dateToStr("%Y-%m-%d")},
                                    {id: "trainEndDateStr", header: "结束日期", width: 100, format: webix.Date.dateToStr("%Y-%m-%d")},
                                    {id: "trainName", header: "培训内容", width: 100},
                                    {id: "trainUnit", header: "培训单位", width: 100},
                                    {id: "trainUser", header: "教员", width: 100},
                                    {id: "trainResult", header: "成绩", width: 100},
                                    {id: "trainAddr", header: "培训地点", fillspace: 1},
                                ],
                                tooltip:true,
                                minHeight: 80,
                                datafetch: 20,//default
                                data: [],
                                onClick: {
                                    remove: function (ev, obj) {
                                        var datatable = $$('trainData');
                                        var item = datatable.getItem(obj.row);
                                        datatable.remove(item.id);
                                    }
                                }
                            },
                            {
                                view: "form",
                                id: 'trainForm',
                                elementsConfig: {
                                    labelAlign: 'right',
                                    labelWidth: 70
                                },
                                elements: [
                                    {
                                        cols: [{
                                            rows: [
                                                {
                                                    cols: [
                                                        {view: "datepicker", label: "开始日期", name: "trainStartDateStr", width: 180, format:"%Y-%m-%d", stringResult: true},
                                                        {view: "datepicker", label: "结束日期", name: "trainEndDateStr", width: 180, format:"%Y-%m-%d", stringResult: true},
                                                        {view: "text", label: "培训内容", name: "trainName", width: 200},
                                                        {view: "text", label: "培训单位", name: "trainUnit", width: 200},
                                                        {view: "text", label: "教员", name: "trainUser", labelWidth: 50,width: 150},
                                                        {view: "richselect", label: "成绩", value:"合格", name: 'trainResult', width: 150, labelWidth: 40, options:[
                                                            {id: '合格', value: "合格"},
                                                            {id: '优秀', value: "优秀"},
                                                            {id: '不合格', value: "不合格"}
                                                        ]},
                                                        {}
                                                    ]
                                                },
                                                {
                                                    cols: [
                                                        {view: "text", label: "培训地点", name: "trainAddr"},
                                                        {},
                                                        {view: "button", label: "新增一条", width: 70, click: function () {
                                                            var fom = $$('trainForm');
                                                            if(fom.validate()){
                                                                var values = fom.getValues();
                                                                $$('trainData').add( fom.getValues() );
                                                                fom.clear();
                                                            }else{
                                                                msgBox("请填写必要信息");
                                                            }
                                                        }}
                                                    ]
                                                },
                                                {},
                                            ]
                                        },{}]
                                    }
                                ],
                                rules:{
                                    "trainStartDateStr":webix.rules.isNotEmpty,
                                    "trainEndDateStr":webix.rules.isNotEmpty,
                                    "trainName":webix.rules.isNotEmpty,
                                    "trainUnit":webix.rules.isNotEmpty,
                                    "trainUser":webix.rules.isNotEmpty,
                                    "trainAddr":webix.rules.isNotEmpty
                                }
                            }
                        ]
                    }
                },
                {
                    cols: [
                        {},
                        {view: "button", label: "保存数据", type: "form", width: 90, click: function(){
                            var baseInfo = $$('baseInfoForm').getValues();
                            removeEmptyProperty(baseInfo);
                            var trainData = webix.copy($$('trainData').data.getRange());
                            var trainIdArr = [];
                            trainData.each(function(item){
                                trainIdArr.push(item.id);
                                delete item.id;
                                removeEmptyProperty(item);
                            });
                            var wormImmueData = webix.copy($$('wormImmueData').data.getRange());
                            var wiIdArr = [];
                            wormImmueData.each(function(item){
                                wiIdArr.push(item.id);
                                delete item.id;
                                removeEmptyProperty(item);
                            });
                            var dogPro = baseInfo.dogPro;
                            var _ar = dogPro.split(',');
                            for(var i = 0; i<_ar.length; i++){
                                trainData.push({
                                trainAddr: 'MAIN',
                                trainEndDateStr:"1900-01-01",
                                trainName: _ar[i],
                                trainStartDateStr: "1900-01-01",
                                trainResult: "合格",
                                trainStage:"-2"});
                            }
                            // baseInfo.trainInfo = trainData;
                            // baseInfo.wormImmueInfo = wormImmueData;
                            baseInfo.workPlace='刑侦总队';
                            var load = doIPost('dogBaseInfo/addDogInfo', {
                                baseInfo: baseInfo,
                                trainData: trainData,
                                wormImmueData: wormImmueData
                            }, function (data) {
                                load.close();
                                if(data.success){
                                    var trainCount = trainData.length - data.trainCount;
                                    var msg = '';
                                    if(trainCount > 0){
                                        msg += '培训信息有' + trainCount + '条，添加失败，请稍后单独添加<br>';
                                    }
                                    var wormCount = wormImmueData.length - data.wormCount - data.immuCount;
                                    if(wormCount > 0){
                                        msg += '驱虫/免疫信息有' + trainCount + '条，添加失败，请稍后单独添加<br>';
                                    }
                                    msgBox('操作成功，数据已经添加<br>' + msg);
                                    $$('baseInfoForm').clear();
                                    $$('trainData').remove(trainIdArr);
                                    $$('wormImmueData').remove(wiIdArr);
                                    location.reload();
                                }else{
                                    msgBox('操作失败，请检查各项信息是否填写正确，<br>错误信息：' + data.message)
                                }
                            });
                        }},
                        {}
                    ]
                },
                {}
            ]
            }
        }
    };
});