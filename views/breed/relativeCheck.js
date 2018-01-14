define([],function() {

    var check = function () {
        var form = $$('breed_from');
        var values = form.getValues();
        if(!values.father){
            webix.message({ type:"error", text:"公犬芯片号不可以为空" });
        }
        if(!values.mother){
            webix.message({ type:"error", text:"母犬芯片号不可以为空" });
        }
        //valid
        if (form.validate()){
            console.log(values);
            doIPost('dogBaseInfo/relativeCheck/' + values.father + '/' + values.mother, {}, function(data){
                console.log(data);
                if(data.success){
                    msgBox('验证通过');
                }else{
                    msgBox(data.message);
                }
                if(!data.result || data.result.length == 0){
                    return ;
                }
                var boy = data.result.boy;
                for(var i in boy){
                    delete boy[i].id;
                }
                var girl = data.result.girl;
                for(var i in girl){
                    delete girl[i].id;
                }
                var cssFormat = function(val, item, id){
                    if('_Tag' == item.dogColour){
                        return 'orange_color';
                    }
                };
                var win = {};
                win = getWin('校验结果', {
                    rows: [
                        {
                            cols: [{
                                rows: [{
                                    template: '公犬[' + values.father + ']三代亲属信息',
                                    borderless: true,
                                    css: 'check_title',
                                    height: 30
                                },{
                                    view:"datatable",
                                    height: 220,
                                    columns:[
                                        { id:"dogSource", header:"关系", width:55, cssFormat: cssFormat},
                                        { id:"chipNo", header:"芯片号", width:100, cssFormat: cssFormat},
                                        { id:"dogName", header:"警犬名称", width:100, cssFormat: cssFormat},
                                        { id:"birthday", header:"出生日期", width:100, format: webix.Date.dateToStr("%Y-%m-%d"), cssFormat: cssFormat}
                                    ],
                                    data: boy
                                }]
                            },{
                                rows: [{
                                    template: '母犬[' + values.mother + ']三代亲属信息',
                                    borderless: true,
                                    css: 'check_title',
                                    height: 30
                                },{
                                    view:"datatable",
                                    height: 220,
                                    columns:[
                                        { id:"dogSource", header:"关系", width:55, cssFormat: cssFormat},
                                        { id:"chipNo", header:"芯片号", width:100, cssFormat: cssFormat},
                                        { id:"dogName", header:"警犬名称", width:100, cssFormat: cssFormat},
                                        { id:"birthday", header:"出生日期", width:100, format: webix.Date.dateToStr("%Y-%m-%d"), cssFormat: cssFormat}
                                    ],
                                    data: girl
                                }]
                            }]
                        },
                        {
                            height: 40,
                            template: '<div style="font-weight: bold; font-size: 14px;color: #color#">校验结果：#message#</div>',
                            data: {
                                color: data.message ? 'yellow' : '#fff',
                                message: data.message || '验证通过，双方亲属无交叉关系'
                            }
                        }
                    ]
                }, {width: 730, height: 350});
                win.show();
            });
        }
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
                    "template": "近亲判断",
                    "css": "sub_title2",
                    borderless: true
                }]
            },
            {
                view: "form",
                id: 'breed_from',
                elementsConfig: {
                    labelWidth: 90
                },
                elements: [
                    {
                        cols: [
                            {view: "text", label: "公犬芯片号", name: "father", width: 300},
                            {width: DEFAULT_PADDING},
                            {view: "text", label: "母犬芯片号", name: "mother", width: 300},
                            {width: DEFAULT_PADDING},
                            {view: "button", label: "近亲验证", type: "form", width: 100, paddingX: 10, click: check},
                            {}
                        ]
                    }
                ],
                rules:{
                    "father":webix.rules.isNotEmpty,
                    "mother":webix.rules.isNotEmpty
                }
            }
        ]
    };

    return { $ui:layout };
});