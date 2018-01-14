define([
    'views/common/constant'
],function(constant) {
    return {
        doTickOut: function(data, datatable){
            var submit = function () {
                console.log(data);
                var form = $$('tickout_form');
                if(form.validate()){
                    var values = form.getValues();
                    var params = [];
                    for(var i = 0; i<data.length; i++){
                        var da = data[i];
                        params.push({
                            applyUnit: values.applyUnit,
                            dogId: da.id,
                            applyUser: USER_INFO.policeName,
                            tickoutDateStr: values.tickoutDate,
                            tickoutReason: values.tickoutReason,
                            tickoutDesc: values.tickoutDesc,
                            belongTo: values.belongTo,
                            applyState: 1,
                            applyDateStr: webix.Date.dateToStr("%Y-%m-%d")(new Date())
                        });
                    }
                    doIPost('apply/tickout/add', params, function (data) {
                        win.close();
                        if (data.success) {
                            datatable.reload();
                            msgBox('操作成功，申请已经提交');
                        } else {
                            msgBox('操作失败<br>' + data.message)
                        }
                    });
                }else{
                    msgBox('请填写申请信息');
                }

            };
            var win = {};
            win = getWin("填写淘汰申请", {
                rows: [
                    {
                        view:"form",
                        id: 'tickout_form',
                        elementsConfig: {
                            labelAlign: 'right'
                        },
                        elements:[
                            {view: "richselect", label: "申请单位", name: "applyUnit", id:'mother_type', labelWidth: 60,width: 200, options: constant.getUnitOptions(), value: USER_INFO.workUnit, readonly: true},
                            {view: "datepicker", label: "淘汰日期", name: "tickoutDate", width: 200, labelWidth: 60, format:"%Y-%m-%d", stringResult: true},
                            {view: "text", label: "淘汰原因", name: "tickoutReason", width: 300, labelWidth: 60, attributes:{ maxlength: 128 }},
                            {view: "text", label: "淘汰归属", name: "belongTo", width: 300, labelWidth: 60, attributes:{ maxlength: 50 }},
                            {view: "textarea", label: "备注", name: "tickoutDesc", width: 300, labelWidth: 60, height:70, attributes:{ maxlength: 254 }}
                        ],
                        rules:{
                            "applyUnit":webix.rules.isNotEmpty,
                            "tickoutDate":webix.rules.isNotEmpty,
                            "tickoutReason":webix.rules.isNotEmpty
                        }
                    },
                    {width: 320},
                    {
                        cols:[
                            {},
                            {view: "button", label: "取消", css: 'non-essential', width: 65, click: function () {
                                win.close();
                            }},
                            {width: DEFAULT_PADDING/2},
                            {view: "button", label: "提交申请", width: 65, click: submit}
                        ]
                    }
                ]
            }, {height: 320});
            win.show();

        },

        doDied: function(data, datatable){
            var submit = function () {
                var form = $$('tickout_form');
                if(form.validate()){
                    var values = form.getValues();
                    var params = [];
                    var uploader = $$('uploader_pic');
                    var picList = [];
                    uploader.files.data.getRange().each(function(item){
                        picList.push(item.serverName);
                    });
                    for(var i = 0; i<data.length; i++){
                        var da = data[i];
                        params.push({
                            dogId: da.id,
                            applyUnit: values.applyUnit,
                            sickReason: values.sickReason,
                            applyDateStr: webix.Date.dateToStr("%Y-%m-%d")(new Date()),
                            sickDateStr: values.sickDate,
                            cureDetail: values.cureDetail,
                            dieDateStr: values.dieDate,
                            photos: picList.join(','),
                            dieReason: values.dieReason,
                            conclus: values.conclus,
                            applyState: 1,
                            applyUser: USER_INFO.policeName
                        });
                    }
                    console.log(params);
                    doIPost('apply/die/add', params, function (data) {
                        win.close();
                        if (data.success) {
                            datatable.reload();
                            msgBox('操作成功，申请已经提交');
                        } else {
                            msgBox('操作失败<br>' + data.message)
                        }
                    });
                }else{
                    msgBox('请填写申请信息');
                }

            };
            var win = {};
            win = getWin("填写申请", {
                rows: [
                    {
                        view:"scrollview",
                        id:"scrollview",
                        scroll:"y",
                        height: 340,
                        body:{
                            rows:[
                                {
                                    view:"form",
                                    id: 'tickout_form',
                                    elementsConfig: {
                                        labelAlign: 'right'
                                    },
                                    elements:[
                                        {view: "richselect", label: "申请单位", name: "applyUnit", id:'mother_type', labelWidth: 60,width: 200, options: constant.getUnitOptions(), value: USER_INFO.workUnit, readonly: true},
                                        {view: "text", label: "病因", name: "sickReason", width: 300, labelWidth: 60, attributes:{ maxlength: 64 }},
                                        {view: "datepicker", label: "发病日期", name: "sickDate", width: 240, timepicker: true, editable: true, labelWidth: 60, format:"%Y-%m-%d", stringResult: true},
                                        {view: "text", label: "救治情况", name: "cureDetail", width: 300, labelWidth: 60, attributes:{ maxlength: 128 }},
                                        {view: "datepicker", label: "死亡时间", name: "dieDate", width: 240, timepicker: true, editable: true, labelWidth: 60, format:"%Y-%m-%d", stringResult: true},
                                        {view: "text", label: "死亡原因", name: "dieReason", width: 300, labelWidth: 60, attributes:{ maxlength: 128 }},
                                        {view: "textarea", label: "结论", name: "conclus", width: 300, labelWidth: 60, height:70, attributes:{ maxlength: 255 }},
                                        {
                                            rows: [
                                                {
                                                    view:"uploader",
                                                    id: "uploader_pic",
                                                    value:"上传图片",
                                                    link:"mylist",
                                                    upload:"/policeDog/services/file/upload",
                                                    datatype:"json"
                                                },
                                                {
                                                    view:"list",
                                                    id:"mylist",
                                                    type:"uploader",
                                                    autoheight:true,
                                                    borderless:true
                                                }
                                            ]
                                        }
                                    ],
                                    rules:{
                                        "applyUnit":webix.rules.isNotEmpty,
                                        "sickReason":webix.rules.isNotEmpty,
                                        "sickDate":webix.rules.isNotEmpty,
                                        "cureDetail":webix.rules.isNotEmpty,
                                        "dieDate":webix.rules.isNotEmpty,
                                        "dieReason":webix.rules.isNotEmpty,
                                        "dieReason":webix.rules.isNotEmpty,
                                        "conclus":webix.rules.isNotEmpty
                                    }
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
                            {view: "button", label: "提交报告", width: 65, click: submit}
                        ]
                    }
                ]
            }, {height: 430});
            win.show();
        }
    };
});