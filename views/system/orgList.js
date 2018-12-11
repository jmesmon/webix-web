define([
    "views/common/constant",
    'views/user/userInfoForm',
], function (constant, userInfoForm) {
    var datatableId = webix.uid().toString();
    var exportData = function(){
        var win = {};
        win = getWin("导出名单", {
            rows: [{
                height: 400,
                view: "datatable",
                id: 'for_export',
                select: true,
                columns: [
                    {id: "$index", header: "NO.", width: 45},
                    {id: "orgName", header: "单位名称", width: 120, sort: "string"},
                    {id: "orgAddr", header: "单位地址", width: 100, sort: "string"},
                    {id: "orgLeader", header: "负责人", width: 90, sort: "string"},
                    {id: "orgConcat", header: "负责人电话", width: 180, sort: "string"},

                    {id: "empQty", header: "分局民警总数", width: 120},
                    {id: "policeCount", header: "训导员人数", width: 120},
                    {id: "dogQty", header: "警犬总数", width: 120},
                    {id: "", header: "警犬警力比", width: 120, template: function(item){
                            var p = parseInt(item.empQty/item.dogQty);
                            return isNaN(p) ? '' : p;
                        }},
                    {id: "dogHouseQty", header: "犬舍", width: 60},
                    {id: "untrainQty", header: "未培训数", width: 90},
                    {id: "trainedQty", header: "已培训数", width: 90}
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
                datafetch: 20,
                customUrl: {
                    url: webix.proxy('customProxy','/policeDog/services/config/getAll/10000/1'),
                    httpMethod: 'post',
                    datatype: 'customJson',
                    params: $$(datatableId).config.customUrl.params
                }
            },{width: 800},
                {
                    cols:[
                        {},
                        {width: 16},
                        {view: "button", label: "下载Excel", width: 65, click: function(){
                                var win = loading('正在生成');
                                setTimeout(function(){
                                    webix.toExcel($$('for_export'), {filename: '警犬列表_' + webix.Date.dateToStr("%Y%m%d%H%i%s")(new Date()) });
                                    win.close();
                                }, 10);
                            }}
                    ]
                }]
        },{width: 800, height: 500});
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
                    {},
                    {view: "button", label: "导出数据", width: 80, click: exportData}
                ]
            },
            {
                id: datatableId,
                view: "datatable",
                select: true,
                columns: [
                    {id: "$index", header: "NO.", width: 45},
                    {id: "orgName", header: "单位名称", width: 120, sort: "string"},
                    {id: "orgLeader", header: "负责人", width: 90, sort: "string"},
                    {id: "orgConcat", header: "负责人电话", width: 180, sort: "string"},

                    {id: "empQty", header: "分局民警总数", width: 120},
                    {id: "policeCount", header: "训导员人数", width: 120},
                    {id: "dogQty", header: "警犬总数", width: 120},
                    {id: "", header: "警犬警力比", width: 120, template: function(item){
                        var p = parseInt(item.empQty/item.dogQty);
                        return isNaN(p) ? '' : p;
                        }},
                    {id: "dogHouseQty", header: "犬舍", width: 60},
                    {id: "untrainQty", header: "未培训数", width: 90},
                    {id: "trainedQty", header: "已培训数", width: 90},
                    {id: "orgAddr", header: "单位地址", width: 260, sort: "string"},
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
                customUrl: {
                    url: webix.proxy('customProxy','/policeDog/services/config/getAll/1/1'),
                    httpMethod: 'post',
                    datatype: 'customJson'
                }
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
                {rows: [datatable]}
            ]
        }
    };
});