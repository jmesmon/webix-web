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
            msgBox('验证通过');
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
                    "template": "查找",
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
                            {view: "text", label: "窝编号", name: "nestNo", width: 300, labelWidth: 60},
                            {width: DEFAULT_PADDING},
                            {view: "button", label: "查找幼犬", type: "form", width: 100, paddingX: 10, click: check},
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