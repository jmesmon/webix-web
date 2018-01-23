define([
    "views/common/constant"
], function (constant) {
    var self = {
        openEdit: function(dogInfo, datatable){
            dogInfo.chipNoInjectStr = dogInfo.chipNoInject;
            dogInfo.birthdayStr = dogInfo.birthday;

            var other_breed = '';
            if(constant.breedType.indexOf(dogInfo.breed) == -1){
                other_breed = dogInfo.breed;
                dogInfo.breed = '其他';
            }

            var win = {};
            var ui = {
                view:"form",
                id: 'dog_base_info_form_update',
                elementsConfig: {
                    labelAlign: 'right',
                    labelWidth: 70
                },
                elements:[{
                    rows:[{
                        cols: [{
                            rows: [
                                {view: "text", label: "警犬名称", name: "dogName"},
                                {view: "text", label: "芯片编号", name: "chipNo", attributes:{ maxlength: 128 }},
                                // {view: "datepicker", label: "注入日期", name: "chipNoInjectStr", format:"%Y-%m-%d", stringResult: true},
                                {view: "richselect", label: "性别", name: 'sex', value:"-1", options:[
                                    {id: '1', value: "公犬"},
                                    {id: '2', value: "母犬"}
                                ]},
                                {view: "datepicker", label: "出生日期", name: "birthdayStr", format:"%Y-%m-%d", stringResult: true},
                                {
                                    cols: [
                                        {view: "richselect", label: "品种", name: 'breed', value:"-1", options: constant.getBreedTypeOptions(),
                                            on: {
                                                onChange: function(newVal){
                                                    if(newVal == '其他'){
                                                        $$('dog_breed').enable();
                                                        return ;
                                                    }else{
                                                        $$('dog_breed').disable();
                                                    }
                                                }
                                            }
                                        },
                                        {view: "text", id: 'dog_breed', width: 150, value: other_breed, disabled: !other_breed, placeholder: '其他品种名称'},
                                    ]
                                },
                                {view: "richselect", label: "来源", name: 'dogSource',  value:"-1", options: constant.getDogSourceOptions() },
                                {view: "richselect", label: "毛色", name: 'dogColour',  value:"-1", options: constant.getDogColorOptions() },
                                {view: "richselect", label: "毛型", name: 'hairType',  value:"-1", options: constant.getHairTypeOptions() },
                                {view: "richselect", label: "工作类型", name: 'dogType',  value:"-1", options: constant.getWorkType() }
                                // {view: "richselect", label: "犬种等级", name: 'dogLevel',  value:"-1", options: constant.getDogLevel() }
                            ]
                        },{width: DEFAULT_PADDING * 2},{
                            rows: [
                                {view: "text", label: "父犬ID号", name: "fatherId", disabled: true},
                                {view: "text", label: "母犬ID号", name: "motherId", disabled: true},
                                {view: "richselect", label: "工作单位", name: "workPlace", disabled: true, options: constant.getUnitOptions()},
                                {view: "richselect", label: "成长阶段", name:"growthStage", options: constant.getGrowthStage()},
                                {view: "richselect", label: "工作状态", name:"workStage", options: constant.getWorkStage()},
                                {view: "text", label: "警犬档案号", name: "fileNo", disabled: false},
                                {view: "text", label: "繁育单位", name: "breeder", disabled: false},
                                // {view: "text", label: "训导员", name: "tutor", disabled: false},
                                // {view: "richselect", label: "复训成绩", name: "trainScore", disabled: false, options: [
                                //         {id: '优秀', value: '优秀'},
                                //         {id: '合格', value: '合格'},
                                //         {id: '不合格', value: '不合格'}
                                // ]},
                                {view: "richselect", label: "所属片区", name: "workArea", options: constant.getDogArea() },
                                {view: "multiselect", label: "专业方向", name: 'mainPro', id: 'dogMainPro', options: constant.getDogPro()},
                            ]
                        }]
                    },{
                        view: "textarea", label: "立功受奖", name: "rewardInfo"
                    },{},{
                        cols:[
                            {},
                            {view: "button", label: "取消", css: 'non-essential', width: 65, click: function () {
                                win.close();
                            }},
                            {width: DEFAULT_PADDING/2},
                            {view: "button", label: "提交", width: 65, click: function () {
                                var dInfo = $$('dog_base_info_form_update').getValues();
                                debugger
                                var other_breed = $$('dog_breed').getValue();
                                if(dInfo.breed == '其他'){
                                    if(!other_breed) {
                                        msgBox('警告，当警犬为“其他”品种时，需要输入具体品种名称。<br>如果不清楚具体品种，请输入“其他”');
                                        return;
                                    }else{
                                        dInfo.breed = other_breed;
                                    }
                                }

                                dInfo.id = dogInfo.id;
                                doIPost('dogBaseInfo/update', [dInfo], function (data) {
                                    if(data.success) {
                                        msgBox("修改成功");
                                        datatable.reload();
                                        win.close();
                                    }else{
                                        msgBox("保存出错：" + data.result);
                                    }
                                });

                            }}
                        ]
                    }]
                }]
            };
            win = getWin('编辑警犬信息', {
                rows: [{
                    width: 800,
                    cols: [ui]
                }]
            }, {height: 450, width: 800});
            win.show();
            var values = $$('dog_base_info_form_update').getValues();
            for(var k in values){
                values[k] = dogInfo[k];
            }
            $$('dog_base_info_form_update').setValues(values);
        }
    };
    return self;
});