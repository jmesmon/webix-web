define([
    "views/common/constant"
], function (constant) {
    var self = {
        openEdit: function(dogInfo, datatable){
            dogInfo.chipNoInjectStr = dogInfo.chipNoInject;
            dogInfo.birthdayStr = dogInfo.birthday;

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
                                {view: "datepicker", label: "注入日期", name: "chipNoInjectStr", format:"%Y-%m-%d", stringResult: true},
                                {view: "richselect", label: "性别", name: 'sex', value:"-1", options:[
                                    {id: '1', value: "公犬"},
                                    {id: '2', value: "母犬"}
                                ]},
                                {view: "datepicker", label: "出生日期", name: "birthdayStr", format:"%Y-%m-%d", stringResult: true},
                                {view: "richselect", label: "品种", name: 'breed', value:"-1", options: constant.getBreedTypeOptions() },
                                {view: "richselect", label: "来源", name: 'dogSource',  value:"-1", options: constant.getDogSourceOptions() },
                                {view: "richselect", label: "毛色", name: 'dogColour',  value:"-1", options: constant.getDogColorOptions() },
                                {view: "richselect", label: "毛型", name: 'hairType',  value:"-1", options: constant.getHairTypeOptions() },
                                {view: "richselect", label: "工作类型", name: 'dogType',  value:"-1", options: constant.getWorkType() },
                                {view: "richselect", label: "犬种等级", name: 'dogLevel',  value:"-1", options: constant.getDogLevel() }
                            ]
                        },{width: DEFAULT_PADDING/2},{
                            rows: [
                                {height: 28},
                                {view: "text", label: "父犬芯片号", name: "fatherId", disabled: false},
                                {view: "text", label: "母犬芯片号", name: "motherId", disabled: false},
                                {view: "richselect", label: "成长阶段", name:"growthStage", options: constant.getGrowthStage()},
                                {view: "richselect", label: "工作状态", name:"workStage", options: constant.getWorkStage()},
                                {view: "text", label: "警犬档案号", name: "fileNo", disabled: false},
                                {view: "text", label: "繁育员", name: "breeder", disabled: false},
                                {view: "text", label: "训导员", name: "tutor", disabled: false},
                                {view: "richselect", label: "复训成绩", name: "trainScore", disabled: false, options: [
                                        {id: '优秀', value: '优秀'},
                                        {id: '合格', value: '合格'},
                                        {id: '不合格', value: '不合格'}
                                ]},
                                {view: "richselect", label: "工作单位", name: "workPlace", disabled: false, options: constant.getUnitOptions()},
                                {view: "richselect", label: "所属片区", name: "workArea", options: constant.getDogArea() }
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
            win = getWin('编辑警犬信息', ui, {height: 450, width: 600});
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