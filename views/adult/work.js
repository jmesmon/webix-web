define([
    "views/common/columns",
    'views/common/constant',
], function (column, constant) {
    var datatableId = webix.uid().toString();

    /**
     * 执行搜索
     */
    var search = function () {
        var datatable = $$(datatableId);
        var params = $$('form').getValues();
        removeEmptyProperty(params, true);
        datatable.config.customUrl.params = params;
        datatable.reload();
    };

    var add = function (id) {
        var isAj = (id == 1 ? false:true);
        var isXl = (id == 2 ? false:true);
        var isXz = (id == 3 ? false:true);
        var isQt = (id == 4 ? false:true);
        var workType = '';
        switch (id){
            case '1':
                workType = '安检';
                break;
            case '2':
                workType = '巡逻';
                break;
            case '3':
                workType = '刑侦';
                break;
            default:
                workType = '其他';
        }
        console.log(workType);
        var attUser = '';
        var readonly = false;
        if(USER_INFO.userRole == 'JingYuan'){
            attUser = USER_INFO.policeName;
            readonly = true;
        }
        var picMap = {};
        var submit = function () {
            var form = $$('add_form');
            var values = form.getValues();
            values.workState = '待审批';
            var uploader = $$('uploader_pic');
            var picList = [];
            uploader.files.data.getRange().each(function(item){
                picList.push({fileName: item.fileName   , url: item.serverName});
            });

            values.workPic = JSON.stringify(picList);
            var data = [values];
            if(form.validate()){
                if(!values.ajCar){
                    values.ajCar=0;
                }
                if(!values.ajPer){
                    values.ajPer=0;
                }
                if(!values.ajWp){
                    values.ajWp=0;
                }
                values.startTimeStr = webix.Date.dateToStr("%Y-%m-%d %H:%i:%s")(values.startTimeStr);
                values.endTimeStr = webix.Date.dateToStr("%Y-%m-%d %H:%i:%s")(values.endTimeStr);
                doIPost('work/add', data, function (data) {
                    if (data.success) {
                        $$(datatableId).reload();
                        msgBox('操作成功，记录新增成功');
                        win.close();
                    } else {
                        msgBox('操作失败<br>' + data.message)
                    }
                });
            }else{
                msgBox('请填写必要信息');
            }

        };
        var win = {};
        win = getWin("添加使用记录-" + workType, {
            rows: [
                {
                    view:"scrollview",
                    id:"scrollview",
                    scroll:"y",
                    height: 450,
                    body:{
                        rows:[
                            {
                                view:"form",
                                id: 'add_form',
                                elementsConfig: {
                                    labelAlign: 'right',
                                    labelWidth: 70
                                },
                                elements:[
                                    {
                                        rows: [
                                            {view: "text", label: "工作类型", name: 'workType', value:workType, width: 240, hidden: true},
                                            {view: "text", label: "编号", name: 'xlNum', value:'', width: 240},
                                            {
                                                cols: [
                                                    {view: "text", label: "出勤人员", name: "attPerson", id: 'attPerson', width: 240, placeholder: '点击选择', attributes:{ maxlength: 64 }, readonly: readonly, value: attUser,
                                                        on: {
                                                            onItemClick: function () {
                                                                if(readonly) return ;
                                                                constant.setUser('attPerson', null, function(){
                                                                    $$('select_dog').config.val = '';
                                                                    $$('select_dog').setValue('');

                                                                    var params = {policeId: $$('attPerson').config.userInfo.id};
                                                                    if(USER_INFO.userRole == 'JingYuan') {
                                                                        params = {policeId: USER_INFO.id};
                                                                    }
                                                                    constant.setDog('select_dog', 'dogId', params);
                                                                });
                                                            }
                                                        }
                                                    },
                                                    {width: 50},
                                                    {view: 'text', value: '', name: "dogId", id: 'dogId', hidden: true},
                                                    {view: "text", label: "出勤警犬", id: 'select_dog', placeholder: '点击选择', width: 240,
                                                        on: {
                                                            onItemClick: function () {
                                                                var params = {policeId: USER_INFO.id};
                                                                if(USER_INFO.userRole != 'JingYuan') {
                                                                    params = {policeId: $$('attPerson').config.userInfo.id};
                                                                }
                                                                constant.setDog('select_dog', 'dogId', params);
                                                            }
                                                        }
                                                    }
                                                ]
                                            },
                                            {view: "text", label: "用犬单位", name: "workUnit", width: 240, attributes:{ maxlength: 64 }},
                                            {view: "text", label: "带队领导", name: "attLeader", width: 240, attributes:{ maxlength: 64 }},
                                        ]
                                    },
                                    {
                                        cols: [
                                            {view: "datepicker", label: "开始时间", timepicker: true, name: "startTimeStr", width: 240, format:"%Y-%m-%d %H:%i:%s"},
                                            {width: 50},
                                            {view: "datepicker", label: "结束时间", timepicker: true, name: "endTimeStr", width: 240, format:"%Y-%m-%d %H:%i:%s"},
                                        ]
                                    },
                                    {view: "text", label: "案件编号", id: 'case_num', hidden: isXz, name: "caseProperty", width: 240, attributes:{ maxlength: 7 }},
                                    {view: "richselect", label: "案件类型", id: 'case_type', hidden: isXz, name: "caseNo", width: 240,
                                        options:[
                                            {id: '一般', value: "一般"},
                                            {id: '重大', value: "重大"},
                                            {id: '特大', value: "特大"}
                                        ]
                                    },{
                                        view: "richselect", label: "检查结果", name: 'isWork', value: "正常", width: 240,
                                        options: [
                                            {id: '正常', value: "正常"},
                                            {id: '异常', value: "异常"}
                                        ]
                                    },
                                    {view: "text", label: "安检等级", hidden: isAj, value: '', placeholder: '一般/重大/特大', name: "ajLevel", width: 240},
                                    {
                                        hidden: isAj,
                                        cols: [
                                            {view: "text", label: "安检面积", name: "securityCheckArea", value: '0', width: 240, attributes:{ maxlength: 7 },
                                                on: {
                                                    onChange: function(newVal, old){
                                                        if(!webix.rules.isNumber(newVal) && newVal != '' ){
                                                            msgBox("输入有误：安检面积必须为数字");
                                                            if(old) {
                                                                this.setValue(old);
                                                            }else{
                                                                this.setValue('');
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {template: '平米', borderless: true}

                                        ]
                                    },
                                    {
                                        // hidden: isAj,
                                        cols: [
                                            {view: "text", label: "检查人次", name: "ajPer", value: '0', width: 240, attributes:{ maxlength: 7 },
                                                on: {
                                                    onChange: function(newVal, old){
                                                        if(!webix.rules.isNumber(newVal) && newVal != '' ){
                                                            msgBox("输入有误：检查人次必须为数字");
                                                            if(old) {
                                                                this.setValue(old);
                                                            }else{
                                                                this.setValue('');
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {template: '人次', borderless: true}

                                        ]
                                    },
                                    {
                                        // hidden: isAj,
                                        cols: [
                                            {view: "text", label: "检查物品", name: "ajWp", value: '0', width: 240, attributes:{ maxlength: 7 },
                                                on: {
                                                    onChange: function(newVal, old){
                                                        if(!webix.rules.isNumber(newVal) && newVal != '' ){
                                                            msgBox("输入有误：检查物品必须为数字");
                                                            if(old) {
                                                                this.setValue(old);
                                                            }else{
                                                                this.setValue('');
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {template: '件', borderless: true}
                                        ]
                                    },
                                    {
                                        cols: [
                                            {view: "text", label: "安检车辆", hidden: isAj, value: '0', name: "ajCar", width: 240, attributes:{ maxlength: 7 },
                                                on: {
                                                    onChange: function(newVal, old){
                                                        if(!webix.rules.isNumber(newVal) && newVal != '' ){
                                                            msgBox("输入有误：检查车辆必须为数字");
                                                            if(old) {
                                                                this.setValue(old);
                                                            }else{
                                                                this.setValue('');
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {template: '辆', borderless: true}
                                        ]
                                    },
                                    {view: "text", label: "地点", hidden: isAj && isXl, name: "ajAddr", attributes:{ maxlength: 255 }},
                                    {view: "text", label: "查获物品", name: "searchWp", attributes:{ maxlength: 200 }, value: '无'},
                                    {view: "textarea", label: "补充说明", name: "workResult", attributes:{ maxlength: 200 }, height: 80, value: '无'},
                                    {
                                        rows: [
                                            {
                                                view:"uploader",
                                                value:"上传附件",
                                                id: 'uploader_pic',
                                                name: 'workPic',
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
                                    "dogId":webix.rules.isNotEmpty,
                                    "attPerson":webix.rules.isNotEmpty,
                                    "workUnit":webix.rules.isNotEmpty,
                                    "startTimeStr":webix.rules.isNotEmpty,
                                    "endTimeStr":webix.rules.isNotEmpty,
                                    "isWork":webix.rules.isNotEmpty,
                                }
                            }
                        ]
                    }
                },
                {width: 800},
                {
                    cols:[
                        {},
                        {view: "button", label: "关闭", css: 'non-essential', width: 65, click: function () {
                            win.close();
                        }},
                        {width: DEFAULT_PADDING/2},
                        {view: "button", label: "保存", width: 65, click: submit}
                    ]
                }
            ]
        }, {height: 550, width: 800});
        win.show();
    };
    var batchAdd = function (id) {
        var isAj = (id == 1 ? false:true);
        var isXl = (id == 2 ? false:true);
        var isXz = (id == 3 ? false:true);
        var isQt = (id == 4 ? false:true);
        var workType = '';
        switch (id){
            case '1':
                workType = '安检';
                break;
            case '2':
                workType = '巡逻';
                break;
            case '3':
                workType = '刑侦';
                break;
            default:
                workType = '其他';
        }
        console.log(workType);
        var attUser = '';
        var readonly = false;
        if(USER_INFO.userRole == 'JingYuan'){
            attUser = USER_INFO.policeName;
            readonly = true;
        }
        var picMap = {};
        var submit = function () {
            var form = $$('add_form');
            var values = form.getValues();
            values.workState = '待审批';
            var uploader = $$('uploader_pic');
            var picList = [];
            uploader.files.data.getRange().each(function(item){
                picList.push({fileName: item.fileName   , url: item.serverName});
            });

            values.workPic = JSON.stringify(picList);
            if(form.validate()){
                if(!values.ajCar){
                    values.ajCar=0;
                }
                if(!values.ajPer){
                    values.ajPer=0;
                }
                if(!values.ajWp){
                    values.ajWp=0;
                }
                values.startTimeStr = webix.Date.dateToStr("%Y-%m-%d %H:%i:%s")(values.startTimeStr);
                values.endTimeStr = webix.Date.dateToStr("%Y-%m-%d %H:%i:%s")(values.endTimeStr);

                var data = [];
                var dogList = $$('policemanAndDog').data.getRange();
                dogList.each(function(userAndDog){
                    var item = webix.copy(values);
                    item.attPerson = userAndDog.attPerson;
                    item.dogId = userAndDog.dogId;
                    data.push(item);
                });
                doIPost('work/add', data, function (data) {
                    if (data.success) {
                        $$(datatableId).reload();
                        msgBox('操作成功，记录新增成功');
                        win.close();
                    } else {
                        msgBox('操作失败<br>' + data.message)
                    }
                });
            }else{
                msgBox('请填写必要信息');
            }

        };
        var win = {};
        win = getWin("批量添加使用记录-" + workType, {
            rows: [
                {
                    view:"scrollview",
                    id:"scrollview",
                    scroll:"y",
                    height: 450,
                    body:{
                        rows:[
                            {
                                view:"form",
                                id: 'add_form',
                                elementsConfig: {
                                    labelAlign: 'right',
                                    labelWidth: 70
                                },
                                elements:[
                                    {
                                        rows: [
                                            {template: '<div style="font-size: 14px;margin-top: -8px">出勤人员和出勤警犬列表</div>', height: 24},
                                            {
                                                view: "datatable",
                                                select: true,
                                                id: 'policemanAndDog',
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
                                                    {id: "attPerson", header: "出勤人员", width: 100},
                                                    {id: "dogName", header: "出勤警犬", width: 570},
                                                ],
                                                tooltip:true,
                                                minHeight: 80,
                                                datafetch: 20,//default
                                                data: [],
                                                onClick: {
                                                    remove: function (ev, obj) {
                                                        var datatable = $$('policemanAndDog');
                                                        var item = datatable.getItem(obj.row);
                                                        datatable.remove(item.id);
                                                    }
                                                }
                                            },
                                            {height: 10},
                                            {
                                                cols: [
                                                    {view: "text", label: "出勤人员", name: "attPerson", id: 'attPerson', width: 240, placeholder: '点击选择', attributes:{ maxlength: 64 }, readonly: readonly, value: attUser,
                                                        on: {
                                                            onItemClick: function () {
                                                                if(readonly) return ;
                                                                constant.setUser('attPerson', null, function(){
                                                                    $$('select_dog').config.val = '';
                                                                    $$('select_dog').setValue('');

                                                                    var params = {policeId: $$('attPerson').config.userInfo.id};
                                                                    if(USER_INFO.userRole == 'JingYuan') {
                                                                        params = {policeId: USER_INFO.id};
                                                                    }
                                                                    constant.setDog('select_dog', 'dogId', params);
                                                                });
                                                            }
                                                        }
                                                    },
                                                    {view: 'text', value: '', name: "dogId", id: 'dogId', hidden: true},
                                                    {view: "text", label: "出勤警犬", id: 'select_dog', placeholder: '点击选择', width: 240,
                                                        on: {
                                                            onItemClick: function () {
                                                                var params = {policeId: USER_INFO.id};
                                                                if(USER_INFO.userRole != 'JingYuan') {
                                                                    params = {policeId: $$('attPerson').config.userInfo.id};
                                                                }
                                                                constant.setDog('select_dog', 'dogId', params);
                                                            }
                                                        }
                                                    },
                                                    {view: "button", label: "添加", width: 65, click: function(){
                                                        $$('policemanAndDog').add({
                                                            id: new Date().getTime(),
                                                            dogName: $$('select_dog').getValue(),
                                                            dogId: $$('dogId').getValue(),
                                                            attPerson: $$('attPerson').getValue()
                                                        });
                                                        $$('select_dog').config.val = '';
                                                        $$('select_dog').setValue('');
                                                        $$('dogId').setValue('');
                                                        $$('attPerson').config.val = '';
                                                        $$('attPerson').setValue('');
                                                    }},
                                                    {}
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        rows: [
                                            {view: "text", label: "工作类型", name: 'workType', value:workType, width: 240, hidden: true},
                                            {view: "text", label: "编号", name: 'xlNum', value:'', width: 240},
                                            {view: "text", label: "用犬单位", name: "workUnit", width: 240, attributes:{ maxlength: 64 }},
                                            {view: "text", label: "带队领导", name: "attLeader", width: 240, attributes:{ maxlength: 64 }},
                                        ]
                                    },
                                    {
                                        cols: [
                                            {view: "datepicker", label: "开始时间", timepicker: true, name: "startTimeStr", width: 240, format:"%Y-%m-%d %H:%i:%s"},
                                            {width: 50},
                                            {view: "datepicker", label: "结束时间", timepicker: true, name: "endTimeStr", width: 240, format:"%Y-%m-%d %H:%i:%s"},
                                        ]
                                    },
                                    {view: "text", label: "案件编号", id: 'case_num', hidden: isXz, name: "caseProperty", width: 240, attributes:{ maxlength: 7 }},
                                    {view: "richselect", label: "案件类型", id: 'case_type', hidden: isXz, name: "caseNo", width: 240,
                                        options:[
                                            {id: '一般', value: "一般"},
                                            {id: '重大', value: "重大"},
                                            {id: '特大', value: "特大"}
                                        ]
                                    },{
                                        view: "richselect", label: "检查结果", name: 'isWork', value: "正常", width: 240,
                                        options: [
                                            {id: '正常', value: "正常"},
                                            {id: '异常', value: "异常"}
                                        ]
                                    },
                                    {view: "text", label: "安检等级", hidden: isAj, value: '', placeholder: '一般/重大/特大', name: "ajLevel", width: 240},
                                    {
                                        hidden: isAj,
                                        cols: [
                                            {view: "text", label: "安检面积", name: "securityCheckArea", value: '0', width: 240, attributes:{ maxlength: 7 },
                                                on: {
                                                    onChange: function(newVal, old){
                                                        if(!webix.rules.isNumber(newVal) && newVal != '' ){
                                                            msgBox("输入有误：安检面积必须为数字");
                                                            if(old) {
                                                                this.setValue(old);
                                                            }else{
                                                                this.setValue('');
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {template: '平米', borderless: true}

                                        ]
                                    },
                                    {
                                        cols: [
                                            {view: "text", label: "检查人次", name: "ajPer", value: '0', width: 240, attributes:{ maxlength: 7 },
                                                on: {
                                                    onChange: function(newVal, old){
                                                        if(!webix.rules.isNumber(newVal) && newVal != '' ){
                                                            msgBox("输入有误：检查人次必须为数字");
                                                            if(old) {
                                                                this.setValue(old);
                                                            }else{
                                                                this.setValue('');
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {template: '人次', borderless: true}

                                        ]
                                    },
                                    {
                                        cols: [
                                            {view: "text", label: "检查物品", name: "ajWp", value: '0', width: 240, attributes:{ maxlength: 7 },
                                                on: {
                                                    onChange: function(newVal, old){
                                                        if(!webix.rules.isNumber(newVal) && newVal != '' ){
                                                            msgBox("输入有误：检查物品必须为数字");
                                                            if(old) {
                                                                this.setValue(old);
                                                            }else{
                                                                this.setValue('');
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {template: '件', borderless: true}
                                        ]
                                    },
                                    {
                                        hidden: isAj,
                                        cols: [
                                            {view: "text", label: "安检车辆", hidden: isAj, value: '0', name: "ajCar", width: 240, attributes:{ maxlength: 7 },
                                                on: {
                                                    onChange: function(newVal, old){
                                                        if(!webix.rules.isNumber(newVal) && newVal != '' ){
                                                            msgBox("输入有误：检查车辆必须为数字");
                                                            if(old) {
                                                                this.setValue(old);
                                                            }else{
                                                                this.setValue('');
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {template: '辆', borderless: true, hidden: isAj}
                                        ]
                                    },
                                    {view: "text", label: "地点", hidden: isAj && isXl, name: "ajAddr", attributes:{ maxlength: 255 }},
                                    {view: "text", label: "查获物品", name: "searchWp", attributes:{ maxlength: 200 }, value: '无'},
                                    {view: "textarea", label: "补充说明", name: "workResult", attributes:{ maxlength: 200 }, height: 80, value: '无'},
                                    {
                                        rows: [
                                            {
                                                view:"uploader",
                                                value:"上传附件",
                                                id: 'uploader_pic',
                                                name: 'workPic',
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
                                    },
                                ],
                                rules:{
                                    "workUnit":webix.rules.isNotEmpty,
                                    "startTimeStr":webix.rules.isNotEmpty,
                                    "endTimeStr":webix.rules.isNotEmpty,
                                    "isWork":webix.rules.isNotEmpty,
                                }
                            }
                        ]
                    }
                },
                {width: 800},
                {
                    cols:[
                        {},
                        {view: "button", label: "关闭", css: 'non-essential', width: 65, click: function () {
                            win.close();
                        }},
                        {width: DEFAULT_PADDING/2},
                        {view: "button", label: "保存", width: 65, click: submit}
                    ]
                }
            ]
        }, {height: 550, width: 800});
        win.show();
    };

    var approve = function(){
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        var arr = [];
        console.log(data);
        var errorCount = 0;
        for(var i = 0; i<data.length; i++){
            var item = data[i];
            if(item.workState == '待审批'){
                arr.push(item);
            }else{
                errorCount ++;
            }
        }
        if(arr.length == 0){
            msgBox("一共选择" + data.length + "条数据，其中" + errorCount + "条已经审批过<br>请选择待审批的数据");
            return ;
        }
        var win = getWin("警犬技术工作审批", {
            rows: [{
                height: 30,
                borderless: true,
                template: '一共选择了' + data.length + '条数据，其中'+arr.length+'条需要审批（'+errorCount+'条已经审批），请审批'
            }, {
                view: "richselect", label: "是否通过", id: 'workState', width: 200, value: '通过', labelWidth: 60,
                options: [
                    {id: '通过', value: "通过"},
                    {id: '驳回', value: "驳回"}
                ]
            }, {
                view: "text",
                label: "审批意见",
                name: "approve",
                id: 'approve',
                labelWidth: 60,
                attributes: {maxlength: 64}
            },
                {width: 400},
                {
                    cols: [
                        {},
                        {
                            view: "button", label: "取消", css: 'non-essential', width: 65, click: function () {
                            win.close();
                        }
                        },
                        {width: DEFAULT_PADDING / 2},
                        {
                            view: "button", label: "提交", width: 65, click: function () {
                            var da = [];
                            for (var i = 0; i < arr.length; i++) {
                                da.push({
                                    id: arr[i].id,
                                    workState: $$('workState').getValue(),
                                    approve: $$('approve').getValue()
                                });
                            }
                            doIPost('work/approve', da, function (res) {
                                win.close();
                                if (res.success) {
                                    $$(datatableId).reload();
                                } else {
                                    msgBox('操作失败<br>' + res.message)
                                }
                            });
                        }
                        }
                    ]
                }]
        }, {width: 440, height: 180});
        win.show();
    };
    var editData = function () {
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        if(data.length == 0){
            msgBox("请选择一条要修改的数据");
            return ;
        }
        var item = data[0];
        if(item.workState != '待审批' &&  item.workState != '驳回' ){
            msgBox("审批通后，不可以修改");
            return ;
        }

        var isAj = (item.workType == '安检' ? false:true);
        var isXl = (item.workType == '巡逻' ? false:true);
        var isXz = (item.workType == '刑侦' ? false:true);
        var isQt = (item.workType == '其他' ? false:true);
        var workType = item.workType;
        var attUser = '';
        var readonly = false;
        if(USER_INFO.userRole == 'JingYuan'){
            attUser = USER_INFO.policeName;
            readonly = true;
        }
        var picMap = {};
        var submit = function () {
            var form = $$('update_form');
            var values = form.getValues();
            var picList = [];
            $$('mylist').data.getRange().each(function(item){
                picList.push({fileName: item.fileName   , url: item.serverName});
            });
            values.workPic = JSON.stringify(picList);
            delete values.dogInfo;
            delete values.$check;
            delete values.$index;
            delete values.creationDate;
            delete values.now;
            delete values.lastUpdateDate;
            delete values.dogList;
            delete values.dogNameLike;
            delete values.roleList;
            delete values.todoList;
            values.startTimeStr = values.startTime;
            values.endTimeStr = values.endTime;
            delete values.startTime;
            delete values.endTime;


            values.workState = '待审批';
            removeEmptyProperty(values);

            if(form.validate()){
                if(!values.ajCar){
                    values.ajCar=0;
                }
                if(!values.ajPer){
                    values.ajPer=0;
                }
                if(!values.ajWp){
                    values.ajWp=0;
                }
                values.approve = '';
                doIPost('work/update', values, function (data) {
                    if (data.success) {
                        $$(datatableId).reload();
                        msgBox('提交成功，等待审批后生效');
                        win.close();
                    } else {
                        msgBox('操作失败<br>' + data.message)
                    }
                });
            }else{
                msgBox('请填写必要信息');
            }

        };

        var win = {};
        win = getWin("修改使用记录-" + workType, {
            rows: [
                {
                    view:"scrollview",
                    id:"scrollview",
                    scroll:"y",
                    height: 450,
                    body:{
                        rows:[
                            {
                                view:"form",
                                id: 'update_form',
                                elementsConfig: {
                                    labelAlign: 'right',
                                    labelWidth: 70
                                },
                                elements:[
                                    {
                                        rows: [
                                            {view: "text", name: 'id', hidden: true},
                                            {view: "text", label: "工作类型", name: 'workType', value:workType, width: 240, hidden: true},
                                            {view: "text", label: "安检编号", name: 'xlNum', value:'', width: 240},
                                            {
                                                cols: [
                                                    {view: "text", label: "出勤人员", name: "attPerson", id: 'attPerson', width: 240, placeholder: '点击选择', attributes:{ maxlength: 64 }, readonly: readonly, value: attUser,
                                                        on: {
                                                            onItemClick: function () {
                                                                debugger
                                                                if(readonly)
                                                                    return ;

                                                                constant.setUser('attPerson', null, function(){
                                                                    $$('select_dog').config.val = '';
                                                                    $$('select_dog').setValue('');

                                                                    var params = {policeId: $$('attPerson').config.userInfo.id};
                                                                    if(USER_INFO.userRole == 'JingYuan') {
                                                                        params = {policeId: USER_INFO.id};
                                                                    }
                                                                    constant.setDog('select_dog', 'dogId', params);
                                                                });
                                                            }
                                                        }
                                                    },
                                                    {view: 'text', value: '', name: "dogId", id: 'dogId', hidden: true},
                                                    {view: "text", label: "出勤警犬", id: 'select_dog', placeholder: '点击选择', width: 240,
                                                        on: {
                                                            onItemClick: function () {
                                                                var params = {policeId: USER_INFO.id};
                                                                if(USER_INFO.userRole != 'JingYuan') {
                                                                    params = {policeId: $$('attPerson').config.userInfo.id};
                                                                }
                                                                constant.setDog('select_dog', 'dogId', params);
                                                            }
                                                        }
                                                    }
                                                ]
                                            },
                                            {view: "text", label: "用犬单位", name: "workUnit", width: 240, attributes:{ maxlength: 64 }},
                                            {view: "text", label: "带队领导", name: "attLeader", width: 240, attributes:{ maxlength: 64 }},
                                        ]
                                    },
                                    {
                                        cols: [
                                            {view: "datepicker", label: "开始时间", timepicker: true, name: "startTimeStr", width: 240, format:"%Y-%m-%d %H:%i:%s", stringResult: true},
                                            {view: "datepicker", label: "结束时间", timepicker: true, name: "endTimeStr", width: 240, format:"%Y-%m-%d %H:%i:%s", stringResult: true},
                                        ]
                                    },
                                    {view: "text", label: "案件编号", id: 'case_num', hidden: isXz, name: "caseProperty", width: 240, attributes:{ maxlength: 7 }},
                                    {view: "text", label: "案件类型", id: 'case_type', hidden: isXz, name: "caseNo", width: 240, },{
                                        view: "richselect", label: "检查结果", name: 'isWork', value: "正常", width: 240,
                                        options: [
                                            {id: '正常', value: "正常"},
                                            {id: '异常', value: "异常"}
                                        ]
                                    },
                                    {view: "text", label: "安检等级", hidden: isAj, value: '一般', name: "ajLevel", width: 240},
                                    {
                                        hidden: isAj,
                                        cols: [
                                            {view: "text", label: "安检面积", name: "securityCheckArea", value: '0', width: 240, attributes:{ maxlength: 7 },
                                                on: {
                                                    onChange: function(newVal, old){
                                                        if(!webix.rules.isNumber(newVal) && newVal != '' ){
                                                            msgBox("输入有误：安检面积必须为数字");
                                                            if(old) {
                                                                this.setValue(old);
                                                            }else{
                                                                this.setValue('');
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {template: '平米', borderless: true}

                                        ]
                                    },
                                    {
                                        // hidden: isAj,
                                        cols: [
                                            {view: "text", label: "检查人次", name: "ajPer", value: '0', width: 240, attributes:{ maxlength: 7 },
                                                on: {
                                                    onChange: function(newVal, old){
                                                        if(!webix.rules.isNumber(newVal) && newVal != '' ){
                                                            msgBox("输入有误：检查人次必须为数字");
                                                            if(old) {
                                                                this.setValue(old);
                                                            }else{
                                                                this.setValue('');
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {template: '人次', borderless: true}

                                        ]
                                    },
                                    {
                                        // hidden: isAj,
                                        cols: [
                                            {view: "text", label: "检查物品", name: "ajWp", value: '0', width: 240, attributes:{ maxlength: 7 },
                                                on: {
                                                    onChange: function(newVal, old){
                                                        if(!webix.rules.isNumber(newVal) && newVal != '' ){
                                                            msgBox("输入有误：检查物品必须为数字");
                                                            if(old) {
                                                                this.setValue(old);
                                                            }else{
                                                                this.setValue('');
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {template: '件', borderless: true}
                                        ]
                                    },
                                    {
                                        cols: [
                                            {view: "text", label: "安检车辆", hidden: isAj, value: '0', name: "ajCar", width: 240, attributes:{ maxlength: 7 },
                                                on: {
                                                    onChange: function(newVal, old){
                                                        if(!webix.rules.isNumber(newVal) && newVal != '' ){
                                                            msgBox("输入有误：检查车辆必须为数字");
                                                            if(old) {
                                                                this.setValue(old);
                                                            }else{
                                                                this.setValue('');
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {template: '辆', borderless: true}
                                        ]
                                    },
                                    {view: "text", label: "地点", hidden: isAj && isXl, name: "ajAddr", attributes:{ maxlength: 255 }},
                                    {view: "text", label: "查获物品", name: "searchWp", attributes:{ maxlength: 200 }, value: '无'},
                                    {view: "textarea", label: "补充说明", name: "workResult", attributes:{ maxlength: 200 }, height: 80, value: '无'},
                                    {
                                        rows: [
                                            {
                                                view:"uploader",
                                                value:"上传附件",
                                                id: 'uploader_pic',
                                                // name: 'workPic',
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
                                    "dogId":webix.rules.isNotEmpty,
                                    "attPerson":webix.rules.isNotEmpty,
                                    "workUnit":webix.rules.isNotEmpty,
                                    "startTimeStr":webix.rules.isNotEmpty,
                                    "endTimeStr":webix.rules.isNotEmpty,
                                    "isWork":webix.rules.isNotEmpty
                                }
                            }
                        ]
                    }
                },
                {width: 800},
                {
                    cols:[
                        {},
                        {view: "button", label: "关闭", css: 'non-essential', width: 65, click: function () {
                            win.close();
                        }},
                        {width: DEFAULT_PADDING/2},
                        {view: "button", label: "保存", width: 65, click: submit}
                    ]
                }
            ]
        }, {height: 550, width: 800});
        win.show();
        item.startTimeStr = item.startTime;
        item.endTimeStr = item.endTime;
        $$('update_form').setValues(item);
        $$('select_dog').setValue(item.dogInfo.dogName);

        setTimeout(function(){
            try{
                var arr = JSON.parse(item.workPic);
                for(var i = 0; i<arr.length; i++){
                    var da = { serverName: arr[i].url, name: arr[i].fileName, fileName: arr[i].fileName };
                    $$('mylist').add(da);
                }
            }catch(e){}
        }, 5);

    };
    var del = function(){
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        if(data.length == 0){
            msgBox("请至少选择一条数据");
            return ;
        }
        webix.confirm({
            text:"确定删除？删除不可恢复", ok:"是", cancel:"否",
            callback:function(res){
                if(res){
                    var w = loading();
                    doPost('work/delete', data, function(data){
                        w.close();
                        if(data.success){
                            datatable.reload();
                        }else{
                            msgBox('操作失败<br>' + data.message)
                        }
                    });
                }
            }
        });
    };

    var exportData = function() {
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        if (data.length == 0) {
            msgBox("请至少选择一条数据");
            return;
        }
        if(data[0].workType != '安检'){
            msgBox('只可以导出安检类型的数据');
            return '';
        }
        doIPost('dogBaseInfo/exportFbAjData', {id: data[0].id}, function (data) {
            console.log(data);
            if(data.success){
                window.open(data.result, '_target');
            }else{
                msgBox('导出失败'+ data.message);
            }
        });
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
                id: 'form',
                elementsConfig: {
                    labelWidth: 90
                },
                elements: [
                    {
                        cols: [
                            {view: "text", label: "出勤人员", name: "attPerson", width: 140, labelWidth: 60},
                            {width: DEFAULT_PADDING},
                            {view: "text", label: "警犬名", name: "dogNameLike", width: 140, labelWidth: 50,placeholder: '模糊搜索'},
                            {width: DEFAULT_PADDING},
                            {view: "text", label: "用犬单位", name: "workUnit", width: 180, labelWidth: 60},
                            {width: DEFAULT_PADDING},
                            {
                                view: "richselect", label: "工作类型", name: 'workType', value: "-1", width: 140,  labelWidth: 60,
                                options: [
                                    {id: '-1', value: "全部"},
                                    {id: '安检', value: "安检"},
                                    {id: '巡逻', value: "巡逻"},
                                    {id: '刑侦', value: "刑侦"},
                                    {id: '其他', value: "其他"}
                                ],
                            },
                            {width: DEFAULT_PADDING},
                            {view: "datepicker", label: "使用日期", name: "startTimeStr",labelWidth: 60, width: 170, format:"%Y-%m-%d", stringResult: true},
                            {view: "datepicker", label: "-", name: "endTimeStr",labelWidth: 10, width: 120, format:"%Y-%m-%d", stringResult: true},
                            {width: DEFAULT_PADDING},
                            {view: "button", label: "查找", type: "form", width: 80, paddingX: 10, click: search},
                            {}
                        ]
                    }
                ]
            }
        ]
    };
    webix.ui({
        view:"popup",
        id:"my_pop2",
        width: 100,
        body:{
            view:"list",
            data:[ {id:"1", name:"安检", location: "New York"},
                {id:"2", name:"巡逻", location:"Salt Lake City"},
                {id:"3", name:"刑侦", location:"Alabama"},
                {id:"4", name:"其他", location:"Alabama"}
            ],
            on:{
                onItemClick: function(id){
                    $$('my_pop2').hide();
                    batchAdd(id);
                }
            },
            datatype:"json",
            template:"#name#",
            autoheight:true
        }
    });
    webix.ui({
        view:"popup",
        id:"my_pop",
        width: 100,
        body:{
            view:"list",
            data:[ {id:"1", name:"安检", location: "New York"},
                {id:"2", name:"巡逻", location:"Salt Lake City"},
                {id:"3", name:"刑侦", location:"Alabama"},
                {id:"4", name:"其他", location:"Alabama"}
            ],
            on:{
                onItemClick: function(id){
                    $$('my_pop').hide();
                    add(id);
                }
            },
            datatype:"json",
            template:"#name#",
            autoheight:true
        }
    });
    var gridPager = {
        rows: [
            {
                view: "form",
                css: "toolbar",
                cols: [
                    {view: "button", label: "添加", width: 50, popup:"my_pop"},
                    {view: "button", label: "批量添加", width: 75, permission: 'work.batchAdd', popup:"my_pop2"},
                    {view: "button", label: "修改", width: 50, permission: 'work.edit',click: editData},
                    {view: "button", label: "删除", permission: 'work.delete', width: 50, click: del},
                    {view: "button", label: "审批", permission: 'work.approve',width: 50, click: approve},
                    {view: "button", label: "导出防爆安检登记表", width: 130, click: exportData},
                    {}
                ]
            },
            {
                id: datatableId,
                view: "datatable",
                select: false,
                minHeight: 80,
                rowHeight: 90,
                datafetch: 20,//default
                tooltip:false,
                columns: [
                    {
                        id: "$check",
                        header: {content: "masterCheckbox"},
                        checkValue: true,
                        uncheckValue: false,
                        template: "{common.checkbox()}",
                        width: 40
                    },
                    {template: function(item){
                        var arr = item.workPic || '';
                        arr = arr.split(',');
                        var picHtml = '';
                        var extr = ["bmp", "png", "jpg", "gif", "jepg"];
                        for(var i = 0; i<arr.length; i++){
                            var isShow = false;
                            for(var j = 0; j<extr.length; j++){
                                if(arr[i].toLowerCase().indexOf(extr[j]) != -1){
                                    isShow = true;
                                    break;
                                }
                            }
                            if(isShow) {
                                picHtml += '<img height="50" src="' + arr[i] + '" class="clickPic">';
                            }else if(arr[i].length > 0){
                                picHtml += '<a href="'+arr[i]+'" target="_blank">下载查看</a>';
                            }
                        }
                        var caseInfo = '';
                        if(item.workType == '刑侦'){
                            caseInfo = '<div style="line-height:20px"><span class="tab_label">案件编号：</span>#caseNo#</div>' +
                            '<div style="line-height:20px"><span class="tab_label">案件性质：</span>#caseProperty#</div>';
                        }else if(item.workType == '安检'){
                            item.securityCheckArea = item.securityCheckArea || '';
                            caseInfo = '<div style="line-height:20px"><span class="tab_label">安检面积：</span>#securityCheckArea#</div>' +
                                '<div style="line-height:20px"><span class="tab_label">安检车辆：</span>#ajCar#</div>'+
                                '<div style="line-height:20px"><span class="tab_label">安检等级：</span>#ajLevel#</div>';
                        }
                        var hasFile = '<a class="showFile" href="javascript:-1">查看附件</a>';
                        if(!item.workPic || item.workPic == '[]'){
                            hasFile = '无';
                        }
                        var html = '<table width="100%">' +
                            '<tr>' +
                            '<td valign="bottom" style="width: 42px; font-size: 16px;line-height:12px;text-align: center">#workType#' +
                            '<span style="font-size: 12px;color:#fff90d"><br><br><br><a class="showApprove" href="javascript:-1">#workState#</a></span>' +
                            '</td>'+
                            '<td style="width: 120px" valign="top">' +
                            '<div style="line-height: 20px"><span class="tab_label">编&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</span>#xlNum#</div>' +
                            '<div style="line-height: 20px"><span class="tab_label">检查人次：</span>#ajPer#</div>' +
                            '<div style="line-height: 20px"><span class="tab_label">检查物品：</span>#ajWp#</div>' +
                            '<div style="line-height: 20px"><span class="tab_label">附件信息：</span>'+hasFile+'</div>' +
                            '</td>' +
                            '<td style="width: 160px" valign="top">' +
                            '<div style="line-height: 20px"><span class="tab_label">犬&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</span>' + (item.dogInfo ? item.dogInfo.dogName || '' : '') + '</div>' +
                            '<div style="line-height: 20px"><span class="tab_label">用犬单位：</span>#workUnit#</div>' +
                            '<div style="line-height: 20px"><span class="tab_label">出勤人员：</span>#attPerson#</div>' +
                            '<div style="line-height: 20px"><span class="tab_label">带队领导：</span>#attLeader#</div>' +
                            '</td>' +
                            '<td valign="top" style="width: 260px">' +
                            '<div style="line-height:20px"><span class="tab_label">开始时间：</span>#startTime#</div>' +
                            '<div style="line-height:20px"><span class="tab_label">结束时间：</span>#endTime#</div>' +
                            '<div style="line-height:20px"><span class="tab_label">查获物品：</span>#searchWp#</div>' +
                            '<div style="line-height:20px"><span class="tab_label">是否起作用：</span>#isWork#</div>' +
                            '</td>' +
                            '<td style="width: 300px" valign="top">' +
                            caseInfo +
                            '<div style="line-height:20px"><span class="tab_label">补&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;充：</span>#workResult#</div>' +
                            '</td>' +
                            // '<td style="line-height: 20px"><div style="overflow-x: auto; overflow-y: hidden; width:400px">'+picHtml +'</div></td>'+
                            '</tr>' +
                            '</table>';
                        return webix.template(html)(item);
                    }, fillspace: 1},
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
                    },
                    showFile: function(a, b ,c){
                        var item = $$(datatableId).getItem(b.row);
                        console.log(item);
                        if(!item.workPic || item.workPic == '[]'){
                            msgBox('没有上传附件');
                            return ;
                        }
                        var data = JSON.parse(item.workPic);
                        var win = getWin("查看附件", {
                            rows: [
                                {
                                    view: "datatable",
                                    select: true,
                                    height: 400,
                                    columns: [
                                        {id: "fileName", header: "附件名称", width: 600, template: function(item){
                                            return '<a href="' + item.url + '" target="_blank">' + item.fileName + '</a>';
                                        }}
                                    ],
                                    tooltip:true,
                                    minHeight: 80,
                                    datafetch: 20,//default
                                    data: data
                                }
                            ]
                        }, { width: 600});
                        win.show();
                    },
                    showApprove: function(a,b,c){
                        var item = $$(datatableId).getItem(b.row);
                        msgBox('审批意见：' + (item.approve || '(未回复)') );
                    },
                    clickPic: function (a, b, c) {
                        var src = a.target.src;
                        var arr = ["bmp", "png", "jpg", "gif", "jepg"];
                        var isShow = false;
                        for(var i = 0; i<arr.length; i++){
                            if(src.toLowerCase().indexOf(arr[i]) != -1){
                                isShow = true;
                                break;
                            }
                        }
                        if(!isShow){
                            window.open(src, '_blank');
                        }else{
                            var win = getWin('图片预览', {
                                template: '<div><img src="'+src+'" style="width:800px; height: 500px" height="500" width="800"></div>'
                            }, {height: 500, width: 800});
                            win.show();
                        }

                    },
                    webix_icon: function (e, id) {
                        webix.confirm({
                            text: "Are you sure sdfds", ok: "Yes", cancel: "Cancel",
                            callback: function (res) {
                                if (res) {
                                    webix.$$("orderData").remove(id);
                                }
                            }
                        });
                    }
                },
                customUrl: {
                    url: webix.proxy('customProxy','/policeDog/services/work/getList/{pageSize}/{curPage}'),
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
        },
        $oninit: function(scope){
        }
    };
});