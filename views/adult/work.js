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
            var uploader = $$('uploader_pic');
            var picList = [];
            uploader.files.data.getRange().each(function(item){
                picList.push(item.serverName);
            });

            values.workPic = picList.join(',');
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
                    height: 330,
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
                                            {view: "text", label: "安检编号", name: 'xlNum', value:'', width: 240, hidden: isAj},
                                            {view: "text", label: "出勤人员", name: "attPerson", width: 240, attributes:{ maxlength: 64 }, readonly: readonly, value: attUser},
                                            {view: 'text', value: '', name: "dogId", id: 'dogId', hidden: true},
                                            {view: "text", label: "出勤警犬", id: 'select_dog', placeholder: '点击选择', width: 240,
                                                on: {
                                                    onItemClick: function () {
                                                        constant.showDogList(function (datatable) {
                                                            var data = datatable.getCheckedData();
                                                            console.log(data);
                                                            var item = data[data.length - 1];
                                                            console.log(item.chipNo);
                                                            $$('select_dog').setValue(item.dogName);
                                                            $$('select_dog').config.val = item.dogName;
                                                            $$('dogId').setValue(item.id);
                                                        });
                                                    },
                                                    onChange: function (newVal, oldVal) {
                                                        if($$('select_dog').config.val){
                                                            $$('select_dog').setValue($$('select_dog').config.val);
                                                        }
                                                    }
                                                }
                                            },
                                            {view: "text", label: "用犬单位", name: "workUnit", width: 240, attributes:{ maxlength: 64 }},
                                            {view: "text", label: "带队领导", name: "attLeader", width: 240, attributes:{ maxlength: 64 }},
                                        ]
                                    },
                                    {
                                        cols: [
                                            {view: "datepicker", label: "开始时间", timepicker: true, name: "startTimeStr", width: 240, format:"%Y-%m-%d %h:%i:%s", stringResult: true},
                                            {view: "datepicker", label: "结束时间", timepicker: true, name: "endTimeStr", width: 240, format:"%Y-%m-%d %h:%i:%s", stringResult: true},
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
                                    {view: "richselect", label: "安检等级", hidden: isAj, name: "ajLevel", width: 240,
                                        options:[
                                            {id: '一般', value: "一般"},
                                            {id: '重大', value: "重大"},
                                            {id: '特大', value: "特大"}
                                        ]
                                    },
                                    {
                                        hidden: isAj,
                                        cols: [
                                            {view: "text", label: "安检面积", name: "securityCheckArea", width: 240, attributes:{ maxlength: 7 }},
                                            {template: '平米', borderless: true}

                                        ]
                                    },
                                    {
                                        hidden: isAj,
                                        cols: [
                                            {view: "text", label: "安检人次", name: "ajPer", width: 240, attributes:{ maxlength: 7 }},
                                            {template: '人次', borderless: true}

                                        ]
                                    },
                                    {
                                        hidden: isAj,
                                        cols: [
                                            {view: "text", label: "安检物品", name: "ajPer", width: 240, attributes:{ maxlength: 7 }},
                                            {}

                                        ]
                                    },
                                    {view: "text", label: "安检车辆", hidden: isAj, name: "ajCar", width: 240, attributes:{ maxlength: 7 }},
                                    {view: "text", label: "地点", hidden: isAj && isXl, name: "ajAddr", attributes:{ maxlength: 7 }},
                                    {view: "text", label: "查获物品", name: "searchWp", attributes:{ maxlength: 7 }},
                                    {view: "textarea", label: "补充说明", name: "workResult", attributes:{ maxlength: 200 }, height: 80},
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
                {width: 500},
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
        }, {height: 420});
        win.show();
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
                            {view: "text", label: "警犬名", name: "dogNameLike", width: 180, labelWidth: 50},
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
                            {view: "button", label: "查找", type: "form", width: 100, paddingX: 10, click: search},
                            {}
                        ]
                    }
                ]
            }
        ]
    };
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
                    console.log('1212_' + id);
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
                    {view: "button", label: "删除", width: 50, click: del},
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
                        var html = '<table width="100%">' +
                            '<tr>' +
                            '<td style="width: 42px; font-size: 16px;">#workType#</td>'+
                            '<td style="width: 180px" valign="top">' +
                            '<div style="line-height: 20px"><span class="tab_label">犬&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</span>#dogInfo.dogName#</div>' +
                            '<div style="line-height: 20px"><span class="tab_label">用犬单位：</span>#workUnit#</div>' +
                            '<div style="line-height: 20px"><span class="tab_label">出勤人员：</span>#attPerson#</div>' +
                            '<div style="line-height: 20px"><span class="tab_label">带队领导：</span>#attLeader#</div>' +
                            '</td>' +
                            '<td valign="top" style="width: 200px">' +
                            '<div style="line-height:20px"><span class="tab_label">开始时间：</span>#startTime#</div>' +
                            '<div style="line-height:20px"><span class="tab_label">结束时间：</span>#endTime#</div>' +
                            '<div style="line-height:20px"><span class="tab_label">查获物品：</span>#searchWp#</div>' +
                            '<div style="line-height:20px"><span class="tab_label">是否起作用：</span>#isWork#</div>' +
                            '</td>' +
                            '<td style="width: 150px" valign="top">' +
                            caseInfo +
                            '<div style="line-height:20px"><span class="tab_label">补&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;充：</span>#workResult#</div>' +
                            '</td>' +
                            '<td style="line-height: 20px"><div style="overflow-x: auto; overflow-y: hidden; width:400px">'+picHtml +'</div></td>'+
                            '</tr>' +
                            '</table>';
                        return webix.template(html)(item);
                    }, fillspace: 1},
                    /*{id: "workType", header: "类型", width: 100},
                    {id: "dogInfo.dogName", header: "犬名", width: 90, template: function(obj){ return obj.dogInfo.dogName || ''; } },
                    {id: "startTime", header: "开始时间", width: 140, format: webix.Date.dateToStr("%Y-%m-%d %h:%i:%s")},
                    {id: "endTime", header: "结束时间", width: 140, format: webix.Date.dateToStr("%Y-%m-%d %h:%i:%s")},
                    {id: "workUnit", header: "用犬单位", width: 110 },
                    {id: "attPerson", header: "出勤人员", width: 110 },
                    {id: "chipProperty", header: "案件性质", width: 110 },
                    {id: "chipNo", header: "案件编号", width: 110 },
                    {id: "isWork", header: "是否起作用", width: 110 },
                    {id: "securityCheckArea", header: "安检面积", width: 110 },
                    {id: "workResult", header: "成果", width: 110 },
                    {id: "", header: "图片", width: 110, template: function (item) {
                        console.log(item);
                        return '<a href="#">查看图片</a>';
                    }},*/
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
                    clickPic: function (a, b, c) {
                        console.log([a, b, c]);
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