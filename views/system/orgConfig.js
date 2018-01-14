define([], function () {

    return {
        $ui: {
            view: 'scrollview',
            body: {
                rows: [
                    {
                        height: 40,
                        template: '<div style="font-size: 18px;font-weight: bold" align="center">分局信息设置</div>'
                    },
                    {
                        cols: [
                            {width: 340},
                            {
                                borderless: true,
                                view: "form",
                                id: 'org_form',
                                css: {'background-color': 'transparent !important'},
                                borderless: true,
                                elementsConfig: {
                                    labelAlign: 'right',
                                    labelWidth: 100,
                                },
                                elements: [
                                    {view: "text", hidden: true, name: 'id'},
                                    {view: "text", label: "单位名称：", width: 400, name: 'orgName', readonly: true},
                                    {view: "text", label: "单位负责人：", width: 400, name: 'orgLeader'},
                                    {view: "text", label: "单位地址：", width: 400, name: 'orgAddr'},
                                    {view: "text", label: "联系方式：", width: 400, name: 'orgConcat'},
                                    {view: "text", label: "员工数量：", width: 400, name: 'empQty'},
                                    // {view: "text", label: "警犬数量：", width: 400, name: 'dogQty'},
                                    {view: "text", hidden: true, name: 'orgPic', id: 'form_orgPic'},
                                    {
                                        view: "richselect", label: "单位所在区：", width: 400, name: 'orgArea',
                                        options: [
                                            {id: '东城区', value: '东城区'},
                                            {id: '西城区', value: '西城区'},
                                            {id: '朝阳区', value: '朝阳区'},
                                            {id: '丰台区', value: '丰台区'},
                                            {id: '石景山区', value: '石景山区'},
                                            {id: '海淀区', value: '海淀区'},
                                            {id: '顺义区', value: '顺义区'},
                                            {id: '通州区', value: '通州区'},
                                            {id: '大兴区', value: '大兴区'},
                                            {id: '房山区', value: '房山区'},
                                            {id: '门头沟区', value: '门头沟区'},
                                            {id: '昌平区', value: '昌平区'},
                                            {id: '平谷区', value: '平谷区'},
                                            {id: '密云区', value: '密云区'},
                                            {id: '怀柔区', value: '怀柔区'},
                                            {id: '延庆区', value: '延庆区'}
                                        ]
                                    },
                                    {view: "textarea", label: "简要介绍：", width: 400, name: 'orgDesc', height:80, attributes:{ maxlength: 200 }},
                                    {
                                        height: 200,
                                        cols: [
                                            {
                                                borderless: true,
                                                id: 'orgPic',
                                                template: '<img src="#orgPic#" width="400" height="198"/>',
                                                data: {orgPic: ''}
                                            },
                                        ]
                                    },
                                    {
                                        cols: [
                                            {width: 100},
                                            {view: "list", id: "mylist", type: "uploader", hidden: true},
                                            {
                                                view: "uploader",
                                                value: '修改图片',
                                                multiple: false,
                                                id: 'up',
                                                autosend: true,
                                                link: "mylist",
                                                width: 90,
                                                upload: "/policeDog/services/file/upload",
                                                on: {
                                                    onFileUpload: function(item, resp){
                                                        console.log([item, resp]);
                                                        console.log(item.serverName);
                                                        $$('orgPic').data.orgPic = item.serverName;
                                                        $$('orgPic').refresh();
                                                        $$('form_orgPic').setValue(item.serverName);
                                                    }
                                                }
                                            },
                                            {width: 50},
                                            {
                                                view: "button", label: "保存修改", width: 80, click: function () {
                                                var form = $$('org_form');
                                                var values = form.getValues();
                                                console.log(values);
                                                doIPost('config/update', values, function (res) {
                                                    if (res.success) {
                                                        msgBox('修改成功');
                                                        getBase();
                                                    } else {
                                                        msgBox('修改失败：<br>' + res.message)
                                                    }
                                                })
                                            }
                                            },
                                            {},
                                        ]
                                    },
                                    {}
                                ]
                            },
                            {}
                        ]
                    }
                ]
            }
        },
        $oninit: function () {
            var l = loading('loading', 30);
            webix.ajax().headers({'Content-Type':  'application/json'}).sync().post('/policeDog/services/config/orgInfo', {orgName: USER_INFO.workUnit}, function(response){
                var data = JSON.parse(response);
                console.log(data);
                if(data.success && data.result && data.result.length > 0){
                    $$('org_form').setValues(data.result[0]);
                    var orgPic = $$('orgPic');
                    orgPic.data.orgPic = data.result[0].orgPic;
                    orgPic.refresh();
                }else{
                    msgBox('加载单位信息出错，请稍后再试')
                }
            });
            l.close();
        }
    };
});