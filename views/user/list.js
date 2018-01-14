define([
    "views/common/constant",
    'views/user/userInfoForm',
], function (constant, userInfoForm) {
    var datatableId = webix.uid().toString();

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
                    doPost('user/delete', data, function(data){
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

    var addOrUpdate = function (item) {
        item = item || {};
        var win = {};
        win = getWin("人员信息", {
            rows: [
                {
                    view:"scrollview",
                    id:"scrollview",
                    scroll:"y",
                    height: 430,
                    body:{
                        rows: [userInfoForm.getForm(false)]
                    }
                },
                {
                    cols:[
                        {},
                        {view: "button", label: "取消", css: 'non-essential', width: 65, click: function () {
                            win.close();
                        }},
                        {width: DEFAULT_PADDING/2},
                        {view: "button", label: "保存", width: 65,
                            click: function () {
                                var form = $$('user_form');
                                if(form.validate()){
                                    var url = 'user/add';
                                    if(item.id){
                                        url = 'user/update';
                                    }
                                    var data = form.getValues();
                                    removeEmptyProperty(data);
                                    doIPost(url, data, function (data) {
                                        if (data.success) {
                                            msgBox('操作成功');
                                            $$(datatableId).reload();
                                            win.close();
                                        } else {
                                            msgBox('操作失败<br>' + data.message)
                                        }
                                    });
                                }else{
                                    msgBox('请填写申请信息');
                                }
                            }
                        }
                    ]
                }
            ]
        }, {height: 550, width: 950});
        win.show();
        if(item && item.id){
            $$('user_form').setValues(item);
        }
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
                id: 'breed_from',
                elements: [
                    {
                        cols: [
                            {view: "text", label: "民警姓名", name: "policeNameLike",labelWidth: 60, width: 220},
                            // {width: DEFAULT_PADDING},
                            {width: DEFAULT_PADDING},
                            // {view: "button", label: "清空", type: "form", width: 70, paddingX: 10, click: function(){
                            //     $$('breed_from').clear();
                            // }},
                            {view: "button", label: "查找", type: "form", width: 70, paddingX: 10, click: function(){
                                var params = $$('breed_from').getValues();
                                removeEmptyProperty(params, true);
                                var tab = $$(datatableId);
                                tab.config.customUrl.params = params;
                                tab.reload();
                            }},
                            {}
                        ]
                    }
                ]
            }
        ]
    };

    var changeRole = function(){
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        if(data.length == 0){
            msgBox("请至少选择一条数据");
            return ;
        }
        var options = [
            {id: "JingYuan", value: "带犬民警"},
            {id: "FJ_JuZhang", value: "分局局长"},
            {id: "GuanLiYuan", value: "分局管理员"}
        ];
        if(USER_INFO.userRole == 'JiuZhiDui' || USER_INFO.userRole == 'SuperMan'){
            options = [
                {id: "JingYuan", value: "带犬民警"},
                {id: "FJ_JuZhang", value: "分局局长"},
                {id: "GuanLiYuan", value: "分局管理员"},
                {id: "JiuZhiDui", value: "九支队"},
                {id: "FanZhiRenYuan", value: "繁殖人员"},
                {id: "PeiXunRenYuan", value: "培训人员"},
                {id: "JuZhang", value: "市局局长"},
                {id: "SuperMan", value: "超级管理员"}
            ]
        }
        if(USER_INFO.userRole == 'FanZhiRenYuan'){
            options = [
                {id: "JingYuan", value: "带犬民警"},
                {id: "FanZhiRenYuan", value: "繁殖人员"}
            ]
        }
        if(USER_INFO.userRole == 'PeiXunRenYuan'){
            options = [
                {id: "JingYuan", value: "带犬民警"},
                {id: "PeiXunRenYuan", value: "培训人员"}
            ]
        }
        var win = getWin("分配权限", {
            rows: [{
                height: 30,
                borderless: true,
                template: '一共选择了'+data.length+'位民警，请设置对应的角色'
            }, {
                view: "richselect", label: "角色名称", id: 'roleName', width: 200, value: '合格', labelWidth: 60,
                options: options
            },
                {width: 400},
                {
                    cols:[
                        {},
                        {view: "button", label: "取消", css: 'non-essential', width: 65, click: function () {
                            win.close();
                        }},
                        {width: DEFAULT_PADDING/2},
                        {view: "button", label: "提交", width: 65, click: function () {
                            var da = [];
                            var roleName = $$('roleName').getValue();
                            for(var i = 0; i<data.length; i++){
                                da.push({id: data[i].id, userRole: roleName});
                            }
                            doIPost('user/setUserRole', da, function(res){
                                win.close();
                                if(res.success){
                                    $$(datatableId).reload();
                                }else{
                                    msgBox('操作失败<br>' + res.message)
                                }
                            });
                        }}
                    ]
                }]
        }, {width: 400, height: 160});
        win.show();
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
                    {view: "button", label: "添加", width: 70, click: function(){addOrUpdate()}},
                    {view: "button", label: "删除", width: 70, click: del},
                    {view: "button", label: "分配权限", width: 80, click: changeRole},
                    {},
                ]
            },
            {
                id: datatableId,
                view: "datatable",
                select: true,
                columns: [
                    {
                        id: "$check",
                        header: {content: "masterCheckbox"},
                        checkValue: 'on',
                        uncheckValue: 'off',
                        template: "{common.checkbox()}",
                        width: 40
                    },
                    {id: "$index", header: "NO.", width: 45},
                    {
                        id: "id",
                        header: "操作",
                        template: '<a class="my_link edit" href="javascript:void(0)"><span class="webix_icon icon fa-pencil-square-o"></span></a>',
                        tooltip: '编辑',
                        width: 50
                    },
                    {id: "policeId", header: "警号", width: 80, sort: "string"},
                    {id: "policeName", header: "姓名", width: 80, sort: "string"},
                    {id: "userRole", header: "系统角色", width: 80, sort: "string", template: function (item) {
                        return {
                            "JingYuan": "带犬民警",
                            "JuZhang": "分局局长",
                            "JiuZhiDui": "九支队",
                            "GuanLiYuan": "分局管理员",
                            "FanZhiRenYuan": "繁殖人员",
                            "PeiXunRenYuan": "培训人员",
                            "SuperMan": "超级管理员"
                        }[item.userRole] || '未配置';
                    }},
                    {id: "sex", header: "性别", width: 50, sort: "string"},
                    {id: "national", header: "民族", width: 50, sort: "string"},
                    {id: "idNun", header: "身份证号", width: 145, sort: "string"},
                    {id: "birthday", header: "出生日期", width: 80, sort: "string"},
                    {id: "onFace", header: "政治面貌", width: 80, sort: "string"},
                    {id: "education", header: "学历", width: 80, sort: "string"},
                    {id: "degree", header: "学位", width: 80, sort: "string"},
                    {id: "graduFrom", header: "毕业院校", width: 80, sort: "string"},
                    {id: "major", header: "专业", width: 120, sort: "string"},
                    {id: "contactInfo", header: "联系方式", width: 100, sort: "string"},
                    {id: "workUnit", header: "工作单位", width: 120, sort: "string"},
                    {id: "workType", header: "身份类别", width: 80, sort: "string"},
                    {id: "dept", header: "部门", width: 80, sort: "string"},
                    {id: "jobTitle", header: "职称", width: 80, sort: "string"},
                    {id: "job", header: "职务", width: 80, sort: "string"},
                    {id: "certQuali", header: "证书资格", width: 80, sort: "string"},
                    {id: "certNum", header: "证书编号", width: 80, sort: "string"},
                    {id: "rewardInfo", header: "立功授奖信息", width: 80, sort: "string"},
                    {id: "approveRole", header: "是否审批人", width: 80, sort: "string", template: function(item){ if(item.approveRole) return '是'; else return '' }},
                    {id: "creationDate", header: "创建日期", width: 85, format: webix.Date.dateToStr("%Y-%m-%d")},
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
                    edit: function (ev, obj) {
                        var datatable = $$(datatableId);
                        var item = datatable.getItem(obj.row);
                        console.log(item);
                        addOrUpdate(item);
                    },
                    showDetail: function (ev, obj, el) {
                        var datatable = $$(datatableId);
                        var item = datatable.getItem(obj.row);
                        if(item.approveDetail){
                            var detail = JSON.parse(item.approveDetail);
                            if(detail.length > 0){

                            }else{
                                msgBox('暂无审批')
                            }
                        }else{
                            msgBox('暂无审批')
                        }
                    }
                },
                tooltip:true,
                minHeight: 80,
                datafetch: 20,//default
                customUrl: {
                    url: webix.proxy('customProxy','/policeDog/services/user/getList/{pageSize}/{curPage}'),
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