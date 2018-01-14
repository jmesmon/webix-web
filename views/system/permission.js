define([
], function () {
    var datatableId = webix.uid().toString();


    var addUser = function () {
        var submit = function () {
            var form = $$('tickout_form');
            if(form.validate()){
                // doIPost('dogBaseInfo/tickout', data, function (data) {
                //     if (data.success) {
                //         datatable.reload();
                msgBox('操作成功，记录新增成功');
                win.close();
                // } else {
                //     msgBox('操作失败<br>' + data.message)
                // }
                // });
            }else{
                msgBox('请填写驱虫信息');
            }

        };
        var win = {};
        win = getWin("授权权人员管理", {
            rows: [
                {
                    view:"scrollview",
                    id:"scrollview",
                    scroll:"y",
                    height: 250,
                    body:{
                        rows:[
                            {
                                view: "datatable",
                                select: true,
                                columns: [
                                    {
                                        id: "$check",
                                        header: {content: "masterCheckbox"},
                                        checkValue: true,
                                        uncheckValue: false,
                                        template: "{common.checkbox()}",
                                        width: 40
                                    },
                                    {id: "policeId", header: "警号", width: 85},
                                    {id: "policeName", header: "姓名", width: 80},
                                    {id: "policeType", header: "类别", width: 60},
                                    {id: "sex", header: "性别", width: 50},
                                    {id: "dept", header: "部门", width: 110},
                                    {id: "job", header: "职务", width: 100},
                                    {id: "concatInfo", header: "联系方式", width: 110},
                                ],
                                on: {
                                    onBeforeLoad: function () {
                                        this.showOverlay("Loading...");
                                    },
                                    onAfterLoad: function () {
                                        this.hideOverlay();
                                    }
                                },
                                tooltip:true,
                                minHeight: 80,
                                datafetch: 20,//default
                                data: [
                                    {$check: true, policeId: '807673', policeName: '王自强', policeType: '民警', sex: '男', dept: '刑侦队', job: '大队长', concatInfo: '18276492154'},
                                    {$check: true,policeId: '807674', policeName: '李青', policeType: '民警', sex: '男', dept: '刑侦队', job: '中队长', concatInfo: '15028398623'},
                                    {$check: true,policeId: '807675', policeName: '张红', policeType: '民警', sex: '女', dept: '刑侦队', job: '小队长', concatInfo: '13429372846'},
                                    {policeId: '807676', policeName: '魏明宇', policeType: '辅警', sex: '男', dept: '站前巡逻队', job: '侦查员', concatInfo: '13428762013'},
                                    {policeId: '807677', policeName: '姚旭波', policeType: '辅警', sex: '男', dept: '站前巡逻队', job: '民警', concatInfo: '13726718653'},
                                    {$check: true,policeId: '807678', policeName: '李洪超', policeType: '辅警', sex: '男', dept: '站前巡逻队', job: '民警', concatInfo: '188765286734'},
                                    {policeId: '807679', policeName: '张义', policeType: '辅警', sex: '男', dept: '站前巡逻队', job: '民警', concatInfo: '18976409264'},
                                    {$check: true,policeId: '807681', policeName: '李想', policeType: '辅警', sex: '男', dept: '站前巡逻队', job: '繁殖人员', concatInfo: '18698036872'},
                                    {policeId: '807682', policeName: '董刚', policeType: '民警', sex: '男', dept: '站前巡逻队', job: '民警', concatInfo: '13729855734'},
                                    {policeId: '807683', policeName: '汤子健', policeType: '民警', sex: '男', dept: '繁殖基地', job: '繁殖人员', concatInfo: '13809823434'},
                                    {policeId: '807684', policeName: '陈小鸿', policeType: '民警', sex: '男', dept: '繁殖基地', job: '兽医', concatInfo: '18176593823'},
                                    {policeId: '807685', policeName: '李文军', policeType: '民警', sex: '男', dept: '繁殖基地', job: '训练员', concatInfo: '18873438745'},
                                    {policeId: '807686', policeName: '侯黎明', policeType: '民警', sex: '男', dept: '繁殖基地', job: '培育员', concatInfo: '17174902845'}
                                ]
                            }
                        ]
                    }
                },
                {width: 640},
                {
                    cols:[
                        {},
                        {view: "button", label: "取消", css: 'non-essential', width: 65, click: function () {
                            win.close();
                        }},
                        {width: DEFAULT_PADDING/2},
                        {view: "button", label: "保存", width: 65, click: function () {
                            win.close();
                        }}
                    ]
                }
            ]
        }, {height: 350, width: 670});
        win.show();
    };

    var gridPager = {
        rows: [
            {
               height: 2
            },
            {
                id: datatableId,
                view: "datatable",
                select: true,
                columns: [
                    {
                        id: "$check",
                        header: {content: "masterCheckbox"},
                        checkValue: true,
                        uncheckValue: false,
                        template: "{common.checkbox()}",
                        width: 40
                    },
                    {
                        id: "process",
                        header: "操作",
                        template: '<div align="center"><a class="my_link edit" href="javascript:void(0)"><span class="webix_icon icon fa-users" style="font-size: 12px;"></span></a></div>',
                        tooltip: '授权人员',
                        width: 60
                    },
                    {id: "privName", header: "权限名称", width: 120},
                    {id: "privDesc", header: "权限描述", width: 85, fillspace: 1}
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
                        var row = datatable.getItem(b.row);
                        console.log(row);
                        addUser(row);
                    }
                },
                tooltip:true,
                minHeight: 80,
                datafetch: 20,//default
                data: [
                    {privName: '繁殖培育', privDesc: '繁殖培养警犬模块的相关的权限'},
                    {privName: '驱虫管理', privDesc: '幼犬驱虫'},
                    {privName: '免疫管理', privDesc: '幼犬管理'},
                    {privName: '专业技能', privDesc: '管理警犬专业技能'},
                    {privName: '技术使用', privDesc: '管理警犬的技术使用'},
                    {privName: '考核培训信息管理', privDesc: '发布、修改、取消考核培训信息'},
                    {privName: '考核培训报名管理', privDesc: '考核培训的报名管理'},
                    {privName: '考核培训成绩管理', privDesc: '管理考核培训的成绩信息'},
                    {privName: '人员管理', privDesc: '初始化民警、辅警的信息，添加辅警信息'},
                    {privName: '系统配置', privDesc: '系统全局配置'},
                    {privName: '免疫周期配置', privDesc: '配置不同疫苗的免疫周期，用于预先提醒'},
                    {privName: '驱虫周期配置', privDesc: '配置驱虫的周期，用于预先提醒'},
                ]
                // customUrl: {
                //     url: webix.proxy('customProxy','/policeDog/services/wormImmue/list/worm/{pageSize}/{curPage}'),
                //     httpMethod: 'post',
                //     datatype: 'customJson'
                // },
            },
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
                        "template": "我的权限列表",
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
                {rows: [datatable]}
            ]
        }
    };
});