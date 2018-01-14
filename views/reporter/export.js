define([
    "../common/constant"
], function (constant) {
    var role = USER_INFO.userRole;
    var readonly = true;
    console.log(["JuZhang", "JiuZhiDui", "SuperMan"].indexOf(role));
    if(["JuZhang", "JiuZhiDui", "SuperMan"].indexOf(role) != -1){
        readonly = false;
    }

    return {
        $ui: {
            type: "space",
            // type: "wide",
            rows: [
                {
                    cols: [
                        {template: '<b>1、导出条件：</b>', width: 120, borderless: true},
                        {view: "datepicker", id: 'startDate', labelAlign: 'right', label: "起止日期", name: "birthdayStr", value: new Date(), format:"%Y-%m-%d", stringResult: true, width: 200},
                        {view: "datepicker", id: 'endDate', labelAlign: 'right', label: "-", name: "birthdayStr", value: new Date(), format:"%Y-%m-%d", stringResult: true, width: 130, labelWidth: 10},
                        {view: "richselect", id: 'workUnit', labelAlign: 'right', label: "工作单位", name: "workPlace", options: constant.getUnitOptions(), value: USER_INFO.workUnit, width: 300, readonly: readonly},
                        {}
                    ]
                },
                {template: '<b>2、请选择报表类型：</b>', borderless: true, height: 30},
                {
                    cols: [
                        {width: 145},
                        {view: 'button', value: '警犬技术量化表', width: 150, click: function () {
                            var startDate = $$('startDate').getValue();
                            var endDate = $$('endDate').getValue();
                            var workUnit = $$('workUnit').getValue();
                            doIPost('dogBaseInfo/exportWorkData', {
                                startDate: startDate,
                                endDate: endDate,
                                workUnit: workUnit
                            }, function (data) {
                                console.log(data);
                                if(data.success){
                                    window.open(data.result, '_blank');
                                }
                            });
                        }},
                        {width: 10},
                        {view: 'button', value: '防爆安检登记表', width: 150, click: function () {
                            msgBox('暂未开放')
                        }},
                        {}
                    ]
                },
                {}
            ]
        }
    };
});