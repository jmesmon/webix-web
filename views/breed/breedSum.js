define([], function () {
var width = 400;
    return {
        $ui: {
            view: 'scrollview',
            body: {
                rows: [
                    {
                        height: 40,
                        template: '<div style="font-size: 18px;font-weight: bold" align="center">繁育数据</div>'
                    },
                    {
                        cols: [
                            {width: 240},
                            {
                                borderless: true,
                                view: "form",
                                id: 'org_form',
                                css: {'background-color': 'transparent !important'},
                                borderless: true,
                                elementsConfig: {
                                    labelAlign: 'right',
                                    labelWidth: 120,
                                },
                                elements: [
                                    {view: "text", hidden: true, name: 'id'},
                                    {view: "text", label: "繁育数量：", width: width, name: 'breedQty'},
                                    {view: "text", label: "配发数量：", width: width, name: 'allotQty'},
                                    {
                                        cols: [
                                            {},
                                            {
                                                view: "button", label: "保存修改", width: 80, click: function () {
                                                    var form = $$('org_form');
                                                    var values = form.getValues();
                                                    console.log(values);
                                                    doIPost('config/updateBreedSum', values, function (res) {
                                                        if (res.success) {
                                                            msgBox('修改成功');
                                                            getBase();
                                                        } else {
                                                            msgBox('修改失败：<br>' + res.message)
                                                        }
                                                    })
                                                }
                                            },
                                            {}
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
            webix.ajax().headers({'Content-Type':  'application/json'}).sync().post('/policeDog/services/config/getBreedSumOrgList', {}, function(response){
                var data = JSON.parse(response);
                console.log(data);
                if(data.success && data.result){
                    $$('org_form').setValues(data.result);
                }else{
                    msgBox('加载出错，请稍后再试')
                }
            });
            l.close();
        }
    };
});