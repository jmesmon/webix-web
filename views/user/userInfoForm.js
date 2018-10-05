define([
    'views/common/constant',
], function (constant) {


    return {
        getForm: function(useBtn){
            var usr = ['JiuZhiDui', 'SuperMan'];
            var isSuperman = false;
            var workUnitCss = 'readonlySe';
            if(usr.indexOf(USER_INFO.userRole) != -1){
                isSuperman = true;
                workUnitCss = '';
            }
            var isExist = false;
            var btn = {
                    cols: [
                        {},
                        {view:"button", label:"保存修改", width: 80, click: function () {
                            var form = $$('user_form');
                            var values = form.getValues();
                            if(!values.policeId) {
                                msgBox('请输入警号/登录名称');
                                return ;
                            }
                            doIPost('user/updateMyInfo', values, function (res) {
                                if (res.success) {
                                    msgBox('修改成功，需要重新登录后才可看到');
                                    getBase();
                                } else {
                                    msgBox('修改失败：<br>' + res.message)
                                }
                            })
                        }},
                        {},
                    ]
                };
            if(!useBtn){
                btn = {};
            }

            return {
                cols: [
                    {
                        view: "form",
                        id: 'user_form',
                        css: {'background-color': 'transparent !important'},
                        borderless: true,
                        elementsConfig: {
                            labelAlign: 'right',
                            labelWidth: 100,
                        },
                        elements: [
                            {
                                cols: [
                                    {view: 'text', name: 'id', hidden: true},
                                    {
                                        view: "text",
                                        label: "民警姓名：",
                                        name: 'policeName',
                                        width: 400
                                    },
                                    {view: "richselect", label: "工作单位：", width: 400, name: 'workUnit', readonly: !isSuperman, value: USER_INFO.workUnit,css: workUnitCss, options: constant.getUnitOptions()},
                                    {}
                                ]
                            },
                            {
                                cols: [
                                    {view: "text", label: "警号/登录名称：", width: 400, name: 'policeId', readonly: ['JiuZhiDui', 'SuperMan', 'GuanLiYuan'].indexOf(USER_INFO.userRole) == -1, on: {
                                            onChange: function (newVal, oldVal) {
                                                var obj = this;
                                                doPost('user/isExist', {
                                                    policeId: newVal,
                                                    policeNameLike: useBtn
                                                }, function (data) {
                                                    if (!data.success) {
                                                        isExist = true;
                                                        msgBox("警号/登录名称已经存在，请重新修改！");
                                                        obj.setValue('');
                                                    }else{
                                                        isExist = true;
                                                    }
                                                });
                                            }
                                        }
                                    },
                                    {view: "text", label: "联系方式：", width: 400, name: 'contactInfo'},
                                    {}
                                ]
                            },
                            {
                                cols: [
                                    {view: "richselect", label: "性别：", width: 400, name: 'sex', options: [{id: '男', value: '男'}, {id: '女', value: '女'}]},
                                    {view: "richselect", label: "身份类别：", width: 400, name: 'workType',
                                        options: [
                                            //民警、辅警、边消警、文职、保安、其他
                                            {id: '民警', value: '民警'},
                                            {id: '辅警', value: '辅警'},
                                            {id: '边消警', value: '边消警'},
                                            {id: '文职', value: '文职'},
                                            {id: '保安', value: '保安'},
                                            {id: '其他', value: '其他'}
                                        ]
                                    },
                                    {}
                                ]
                            },
                            {
                                cols: [
                                    {view: "text", label: "民族：", width: 400, name: 'national'},
                                    {view: "text", label: "部门：", width: 400, name: 'dept'},
                                    {}
                                ]
                            },
                            {
                                cols: [
                                    {view: "text", label: "身份证号：", width: 400, name: 'idNun',
                                        on: {
                                            onChange: function(newVal, oldVal){
                                                if(oldVal) {
                                                    if (newVal.length == 18) {
                                                        var year = newVal.substr(6, 4);
                                                        var month = newVal.substr(10, 2);
                                                        var day = newVal.substr(12, 2);
                                                        var da = new Date(year + '-' + month + '-' + day);
                                                        $$('birthday_id').setValue(year + '-' + month + '-' + day);
                                                    } else {
                                                        msgBox('身份证号输入不正确，请重新输入')
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {view: "richselect", label: "职称：", width: 400, name: 'jobTitle',
                                        options: [
                                            //警犬技术初级工程师、警犬技术中级工程师、警犬技术高级工程师、正高级
                                            {id: '警犬技术初级工程师', value: '警犬技术初级工程师'},
                                            {id: '警犬技术中级工程师', value: '警犬技术中级工程师'},
                                            {id: '警犬技术高级工程师', value: '警犬技术高级工程师'},
                                            {id: '正高级', value: '正高级'},
                                        ]
                                    },
                                    {}
                                ]
                            },
                            {
                                cols: [
                                    {view: "datepicker", id: 'birthday_id', label: "出生日期：", width: 400, name: 'birthday', format:"%Y-%m-%d", stringResult: true},
                                    {view: "richselect", label: "职务：", width: 400, name: 'job',
                                        options: [
                                            //科员，副科职、正科职、副处职、正处职、副厅职、正厅职、其他带犬人员
                                            {id: '科员', value: '科员'},
                                            {id: '副科职', value: '副科职'},
                                            {id: '正科职', value: '正科职'},
                                            {id: '副处职', value: '副处职'},
                                            {id: '正处职', value: '正处职'},
                                            {id: '副厅职', value: '副厅职'},
                                            {id: '正厅职', value: '正厅职'},
                                            {id: '其他带犬人员', value: '其他带犬人员'}
                                        ]
                                    },
                                    {}
                                ]
                            },
                            {
                                cols: [
                                    {view: "richselect", label: "政治面貌：", width: 400, name: 'onFace',
                                        options: [
                                            {id: '党员', value: '党员'},
                                            {id: '团员', value: '团员'},
                                            {id: '群众', value: '群众'},
                                            {id: '无党派人士', value: '无党派人士'}
                                        ]
                                    },
                                    {}
                                ]
                            },
                            {
                                cols: [
                                    {view: "text", label: "毕业院校：", width: 400, name: 'graduFrom'},
                                    {view: "text", label: "专业：", width: 400, name: 'major'},
                                    {}
                                ]
                            },
                            {
                                cols: [
                                    {view: "richselect", label: "学历：", width: 400, name: 'education',
                                        options: [
                                            {id: '中专', value: '中专'},
                                            {id: '大专', value: '大专'},
                                            {id: '本科', value: '本科'},
                                            {id: '硕士研究生', value: '硕士研究生'},
                                            {id: '博士研究生', value: '博士研究生'},
                                            {id: '博士后', value: '博士后'},
                                        ]
                                    },
                                    {view: "richselect", label: "学位：", width: 400, name: 'degree',
                                        options: [
                                            //学士学位、硕士学位、博士学位
                                            {id: '', value: '无'},
                                            {id: '学士学位', value: '学士学位'},
                                            {id: '硕士学位', value: '硕士学位'},
                                            {id: '博士学位', value: '博士学位'}
                                        ]
                                    },
                                    {}
                                ]
                            },
                            {
                                cols: [
                                    {view: "richselect", label: "证书资格：", width: 400, name: 'certQuali',
                                        options: [
                                            //警犬训练一级、警犬训练二级、警犬训练三级、警犬训练四级
                                            {id: '警犬训练一级', value: '警犬训练一级'},
                                            {id: '警犬训练二级', value: '警犬训练二级'},
                                            {id: '警犬训练三级', value: '警犬训练三级'},
                                            {id: '警犬训练四级', value: '警犬训练四级'}
                                        ]
                                    },
                                    {view: "text", label: "证书编号：", width: 400, name: 'certNum' },
                                    {}
                                ]
                            },
                            {
                                cols: [
                                    {view: "textarea", label: "立功授奖信息：", width: 800, height: 150, name:'rewardInfo', placeholder: '填写示例：\r\n2017-09-12：三等功\n' +
                                    '2017-02-21：优秀标兵\n' +
                                    '2016-01-21：优秀标兵'},
                                    {}
                                ]
                            },
                            {
                                height: 20,
                                cols: [
                                    { width: 100},
                                    {borderless: true, template: '<div style="margin-top: -10px">填写格式【时间：证书名称】，例如：2017-09-12：三等功；2017-02-21：优秀标兵；</div>'}
                                ]
                            },
                            btn,
                            {}
                        ]
                    }
                ]
            };
        }
    };
});