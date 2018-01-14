define(["models/orders"], function (orders) {

    var titlePager = {
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
                    {view: "button", label: "驱虫", width: 65},
                    {view: "button", label: "免疫", width: 65},
                    {}
                ]
            },
            {
                id: "orderData",
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
                    {id: "$index", header: "NO.", width: 60},
                    {
                        id: "id",
                        header: "操作",
                        template: '<a class="my_link edit" href="javascript:void(0)"><span class="webix_icon icon fa-pencil-square-o"></span></a>',
                        tooltip: '编辑',
                        width: 60
                    },

                    {id: "nestNo", header: "窝编号", width: 130, sort: "string"},
                    {id: "dogName", header: "犬名", width: 90},
                    {id: "chipNo", header: "芯片号", width: 90},
                    {id: "chipNoInject", header: "芯片注入日期", width: 90, format: webix.Date.dateToStr("%Y-%m-%d")},
                    {id: "sex", header: "性别", width: 90},
                    {id: "birthday", header: "出生日期", sort: "string", format: webix.Date.dateToStr("%Y-%m-%d")},
                    {id: "fatherId", header: "父亲芯片号", width: 90},
                    {id: "motherId", header: "母亲芯片号", width: 90},
                    {id: "breed", header: "品种", width: 130, sort: "string"},
                    {id: "dogSource", header: "来源", width: 130, sort: "string"},
                    {id: "dogColour", header: "毛色", width: 130, sort: "string"},
                    {id: "hairType", header: "毛型", width: 130, sort: "string"},
                    {id: "breeder", header: "繁育员", width: 130, sort: "string"},
                    {id: "tutor", header: "训导员", width: 100}
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
                tooltip:true,
                minHeight: 80,
                datafetch: 20,//default
                customUrl: {
                    // autoload: true,
                    url: webix.proxy('customProxy','/policeDog/services/dogBaseInfo/getAll/{pageSize}/{curPage}'),
                    httpMethod: 'post',
                    // params: {id: 1, dogName: 'xus', pageSize: 12},
                    datatype: 'customJson'
                },
                // data: orders.getAll,
                pager: "pagerA"
            },
            {
                view: "pager",
                id: "pagerA",
                size: 20,
                group: 5,
                // template:function(data, common){
                //     debugger
                //     var current = data.page + 1;
                //     var html = "<select onchange='grida.setPage(this.value)' style='text-align:center; width:150px'>";
                //     for (var i=1; i<=data.limit; i++)
                //         html+="<option "+(i == current?"selected='true'":"")+">"+i+"</option>";
                //     html+="</select> from "+data.limit;
                //     return html;
                // },
                template: "{common.first()}{common.prev()}{common.pages()}{common.next()}{common.last()}<div style='float: right'>总共#count#条</div>"
            }
        ]
    };


    var layout = {
        type: "clean",
        rows: [
            titlePager,
            gridPager
        ]
    };

    return {$ui: layout};

});