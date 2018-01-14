define([
    'views/common/constant'
],function(constant) {

    var currentStep = 1;
    var lastCount  = 0;

    var nextStep = function(){
        if(currentStep == 1){
            if(!validStrep1()){
                return ;
            }

            currentStep = 2;
            $$('step1').hide();
            $$('step2').show();
            $$('step3').hide();
            $$('preStep').show();
            var stepInfo = $$('stepInfo');
            stepInfo.data.step1 = 'reproduce_finish';
            stepInfo.data.step2 = 'reproduce_active';
            stepInfo.data.step3 = '';
            stepInfo.refresh();
            addChild();
        }else if(currentStep == 2){
            currentStep = 3;
            saveDogInfo(function(msgArr){
                $$('step1').hide();
                $$('step2').hide();
                $$('step3').show();
                $$('preStep').hide();
                $$('nextStep').hide();
                $$('finishStep').show();
                var stepInfo = $$('stepInfo');
                stepInfo.data.step1 = 'reproduce_finish';
                stepInfo.data.step2 = 'reproduce_finish';
                stepInfo.data.step3 = 'reproduce_active';
                stepInfo.refresh();

                $$('detail').data.detail = msgArr.join('<br>');
                $$('detail').refresh();
            });
        }
    };

    var preStep = function () {
        if(currentStep == 2){
            currentStep = 1;
            $$('step1').show();
            $$('step2').hide();
            $$('step3').hide();
            $$('preStep').hide();
            var stepInfo = $$('stepInfo');
            stepInfo.data.step1 = 'reproduce_active';
            stepInfo.data.step2 = '';
            stepInfo.data.step3 = '';
            stepInfo.refresh();
        }else if(currentStep == 3){
            currentStep = 2;
            $$('step1').hide();
            $$('step2').show();
            $$('step3').hide();
            $$('preStep').show();
            var stepInfo = $$('stepInfo');
            stepInfo.data.step1 = 'reproduce_finish';
            stepInfo.data.step2 = 'reproduce_active';
            stepInfo.data.step3 = '';
            stepInfo.refresh();
        }
    };

    var finished = function () {
        var values = $$('reproduce').getValues();
        currentStep = 1;
        $$('step1').show();
        $$('step2').hide();
        $$('step3').hide();
        $$('preStep').hide();
        $$('nextStep').show();
        $$('finishStep').hide();
        var stepInfo = $$('stepInfo');
        stepInfo.data.step1 = 'reproduce_active';
        stepInfo.data.step2 = '';
        stepInfo.data.step3 = '';
        stepInfo.refresh();
    };

    var addChild = function () {
        var contain = $$('step2');
        var values = $$('reproduce').getValues();
        var count = values.litterSize || 0;
        var fatherName = values.father_name;
        var motherName = values.mother_name;
        var father_type = values.father_type;
        for(var i = lastCount; i<count; i++) {
            contain.addView(
                {
                    cols: [
                        {view: "text", label: "犬名:", id: 'dog_name_' + i, name: "dog_name", width: 200, value: fatherName + '_' + motherName + '_幼犬' + (i + 1), labelWidth: 45},
                        {width: 10},
                        {
                            view: "select",
                            label: "性别:",
                            name: 'sex',
                            value: "1",
                            id: 'sex_' + i,
                            width: 125,
                            editable: false,
                            labelWidth: 45,
                            options: [{id: 1, value: "公犬"}, {id: 2, value: "母犬"}]
                        },
                        {width: 10},
                        {
                            view: "select", label: "犬品种:", id: 'breed_' + i, name: "breed", width: 180, labelWidth: 65, value: father_type,
                            options: constant.breedType
                        },
                        {width: 10},
                        {
                            view: "select", label: "毛色:", id: 'dogColour_' + i, name: "dogColour", width: 130, labelWidth: 45,
                            options: constant.dogColor
                        },
                        {width: 10},
                        {
                            view: "select", label: "毛型:", id: 'hireType_' + i, name: "hireType", width: 130, labelWidth: 45,
                            options: constant.hairType
                        }, {}
                    ]
                }
            );
            lastCount = count;
        }
    };

    var validStrep1 = function () {
        var state = true;
        var msg = [];
        var values = $$('reproduce').getValues();
        if(!values.father_chip_no){
            state = false;
            msg.push('请填写父犬芯片号');
        }
        if(!values.father_name){
            state = false;
            msg.push('请填写父犬名称');
        }
        if(!values.father_type){
            state = false;
            msg.push('请填写父犬品种');
        }

        if(!values.mother_chip_no){
            state = false;
            msg.push('请填写母犬芯片号');
        }
        if(!values.mother_name){
            state = false;
            msg.push('请填写母犬名称');
        }
        if(!values.mother_type){
            state = false;
            msg.push('请填写母犬品种');
        }

        if(!values.mateDate){
            state = false;
            msg.push('请填写交配日期');
        }
        if(!values.litterSize){
            state = false;
            msg.push('请填写产仔数');
        }
        if(!values.birthday){
            state = false;
            msg.push('请填写生育时间');
        }
        if(!values.breeder){
            state = false;
            msg.push('请填写繁育员');
        }
        if(msg.length > 0) {
            msgBox('<div align="left">信息填写不完整，请检查：<br>' + msg.join("<br>") + '</div>');
        }
        return true;
    };

    var onChange = function(val, isFather){
        doPost('dogBaseInfo/get', {chipNo: val}, function (data) {
            console.log(data);
            if(data.success && data.result.length > 0){
                var dog = data.result[0];
                if(isFather){
                    if(dog.sex == 2){
                        msgBox("性别错误！<br>芯片号：" + val + "的警犬性别为母犬，请输入公犬芯片号");
                        return ;
                    }
                    $$('father_name').setValue(dog.dogName);
                    $$('father_type').setValue(dog.breed);
                }else{
                    if(dog.sex == 1){
                        msgBox("性别错误！<br>芯片号：" + val + "的警犬性别为公犬，请输入母犬芯片号");
                        return ;
                    }
                    $$('mother_name').setValue(dog.dogName);
                    $$('mother_type').setValue(dog.breed);
                }
            }else{
                msgBox('没有芯片号为：' + val + '的警犬信息')
            }
        });
    };

    var saveDogInfo = function (callback) {
        var children = [];
        var values = $$('reproduce').getValues();

        var nestNo = values.birthday.replace(/-/g, '');
        if(values.litterSize < 10 && values.litterSize > 0){
            nestNo = nestNo + '00' + values.litterSize;
        }else if(values.litterSize >= 10 && values.litterSize < 100){
            nestNo = nestNo + '0' + values.litterSize;
        }else{
            nestNo = nestNo  + values.litterSize;
        }

        nestNo += Math.round(Math.random() * 1000);

        for(var i = 0; i<values.litterSize; i++){
            var child = {
                dogName: $$('dog_name_' + i).getValue(),
                sex: $$('sex_' + i).getValue(),
                breed: $$('breed_' + i).getValue(),
                dogColour: $$('dogColour_' + i).getValue(),
                hireType: $$('hireType_' + i).getValue(),

                birthdayStr: values.birthday,
                dogSource: '自繁',
                breeder: values.breeder,
                fatherId: values.father_chip_no,
                motherId: values.mother_chip_no,
                growthStage: 1,
                workStage: 1,
                nestNo: nestNo  //窝编号：出生日期 + 数量 + 随机数
            };
            children.push(child);
        }
        console.log(children);
        var win = loading('正在添加基本信息');

        doPost('dogBaseInfo/addDog', children, function(data){
            win.close();
            var msgInfo = [];
            if(data.success){
                win = loading('基本信息添加完成，生成驱虫计划');
                webix.message('基本信息添加完成');
                msgInfo.push('窝编号：' + nestNo);
                msgInfo.push('1、基本信息添加完成');
                doPost('dogBaseInfo/initWormInfo/' + nestNo, {}, function(data){
                    win.close();
                    if(data.success){
                        win = loading('驱虫计划创建完成，正在创建免疫计划');
                        webix.message('驱虫计划创建完成');
                        msgInfo.push('2、驱虫计划创建完成');
                    }else{
                        msgBox('驱虫计划创建失败，请稍后手动添加');
                        msgInfo.push('2、驱虫计划创建失败，请稍后手动添加');
                    }
                    createImmue(nestNo, win, callback, msgInfo);
                }, function () {
                    msgBox('驱虫计划创建失败，请稍后手动添加');
                    createImmue(nestNo, win, callback, msgInfo);
                    msgInfo.push('2、驱虫计划创建失败，请稍后手动添加');
                });
            }else{
                msgBox('操作失败，请稍后再试');
                win.close();
            }
        }, function () {
            msgBox('操作失败，请稍后再试')
        });
    };

    var createImmue = function (nestNo, win, callback, msgInfo) {
        win.close();
        win = loading('驱虫计划创建完成，正在创建免疫计划');
        doPost('dogBaseInfo/initImmueInfo/' + nestNo, {}, function(data){
            win.close();
            if(data.success){
                webix.message('免疫计划创建完成');
                msgInfo.push('3、免疫计划创建完成');
                //操作完成
            }else{
                msgBox('免疫计划创建失败，请稍后手动添加');
                msgInfo.push('3、免疫计划创建失败，请稍后手动添加');
            }
            callback(msgInfo);
        }, function(){
            msgBox('免疫计划创建失败，请稍后手动添加');
            msgInfo.push('3、免疫计划创建失败，请稍后手动添加');
            win.close();
            callback(msgInfo);
        })
    };

    var layout = {
        type: "clean",
        rows: [
            {
                view: "toolbar",
                css: "highlighted_header header1",
                paddingX: 5,
                paddingY: 5,
                height: 40,
                cols: [{
                    template: "幼犬繁育",
                    css: "sub_title2",
                    borderless: true
                }]
            },
            {
                view: "form",
                id: 'reproduce',
                elementsConfig: {
                    labelWidth: 90
                },
                elements: [
                    {
                        id: 'step1',
                        cols: [
                            {
                                rows: [
                                    {view: "text", label: "父犬芯片号", name: "father_chip_no", width: 300, on:{onChange: function(){
                                        onChange(this.getValue(), true);
                                    }}},
                                    {view: "text", label: "父犬犬名", name: "father_name", id:'father_name', width: 300, readonly: true, placeholder: '自动填充'},
                                    {
                                        view: "select", label: "父犬品种", name: "father_type", id:'father_type', width: 300, value: '其他',
                                        options: constant.breedType, readonly: true
                                    },
                                    {view: "datepicker", label: "交配日期", name: "mateDate", width: 300, value: new Date(), format:"%Y-%m-%d", stringResult: true},
                                    {view: "text", label: "产仔数", name: "litterSize", width: 300}
                                ]
                            },
                            {width: DEFAULT_PADDING},
                            {
                                rows: [
                                    {view: "text", label: "母犬芯片号", name: "mother_chip_no", width: 300, on:{onChange: function(){
                                        onChange(this.getValue(), false);
                                    }}},
                                    {view: "text", label: "母犬犬名", name: "mother_name", id:'mother_name', width: 300, readonly: true, placeholder: '自动填充'},
                                    {
                                        view: "select", label: "母犬品种", name: "mother_type", id:'mother_type', width: 300, value: '其他',
                                        options: constant.breedType, readonly: true
                                    },
                                    {view: "datepicker", label: "生育时间", name: "birthday", width: 300, format:"%Y-%m-%d", stringResult: true},
                                    {view: "text", label: "繁育员", name: "breeder", width: 300}
                                ]
                            },
                            {}
                        ]
                    },
                    {
                        id: 'step2',
                        hidden: true,
                        rows: [
                            {
                                template: '<div style="border-bottom: 1px solid #DDDDDD;">请填写幼犬简要信息</div>',
                                height: 30,
                                borderless: true
                            }
                        ]
                    },
                    {
                        id: 'step3',
                        hidden: true,
                        rows: [{},{
                            cols: [{
                                borderless: true,
                                height: 110,
                                id: 'detail',
                                template: '<div align="center" style="font-size: 16px; font-weight: bold;">数据已保存</div><div align="center"><br>#detail#</div>',
                                data: {
                                    detail: ''
                                }
                            }]
                        },{}]
                    },
                    {
                        template: '<div style="border-top: 1px solid #DDDDDD;"></div>',
                        height: 10,
                        borderless: true
                    },
                    {
                        cols: [
                            {
                                width: 638,//458
                                borderless: true,
                                id: 'stepInfo',
                                template: '<span class="reproduce_flu">繁育步骤</span>：<span class="#step1#">种犬信息</span>-><span class="#step2#">幼犬信息</span>-><span class="#step3#">完成</span>',
                                data: {
                                    step1: 'reproduce_active',
                                    step2: '',
                                    step3: ''
                                }
                            },
                            {view: "button", label: "上一步", width: 100, hidden:true, id: 'preStep', click: preStep},
                            {view: "button", label: "下一步", type: "form", width: 100,id: 'nextStep', click: nextStep},
                            {view: "button", label: "完 成", type: "form", hidden:true, width: 100, id: 'finishStep', click: finished},
                            {}
                        ]
                    }
                ]
            }
        ]
    };

    return { $ui:layout };
});