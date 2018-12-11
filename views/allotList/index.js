define([
    'views/common/columns',
    'views/common/tickout',
    'views/common/editDogInfo',
    'views/common/constant',
    'views/allotList/action',
], function (columns, tickout, editDog, constant, actions) {
    var datatableId = webix.uid().toString();
    var formId = webix.uid().toString();
    var Actions = actions.init(formId, datatableId);

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
                id: formId,
                elementsConfig: {
                    labelWidth: 90
                },
                elements: [
                    {
                        rows: [{
                            cols: [
                                {view: "text", label: "警犬名称", name: "dogNameLike", width: 200, labelWidth: 70, placeholder: '支持搜索'},
                                {width: DEFAULT_PADDING},
                                {view: "text", label: "芯片号", name: "hairType", width: 200, labelWidth: 70, placeholder: '支持搜索'},
                                {width: DEFAULT_PADDING},
                                {view: "text", label: "单位名称", name: "workUnit", width: 200, labelWidth: 70, placeholder: '支持搜索'},
                                {width: DEFAULT_PADDING},
                                {view: "button", label: "清空", type: "form", width: 70, paddingX: 10, click: function(){
                                    $$(formId).clear();
                                }},
                                {view: "button", label: "查找", type: "form", width: 70, paddingX: 10, click: Actions.doSearch },
                                {}
                            ]
                        }]
                    }
                ]
            }
        ]
    };
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
                    {id: "dogName", header: "警犬名称", width: 100, sort: "string"},
                    {id: "breed", header: "品种", width: 90, sort: "string"},
                    {id: "hairType", header: "芯片号", width: 80, sort: "string"},
                    {id: "dogColor", header: "出生日期", width: 80, sort: "string"},
                    {id: "sex", header: "性别", width: 60, sort: "string"},
                    {id: "owner", header: "训导员", width: 100, sort: "string"},
                    {id: "workUnit", header: "所属单位", width: 120, sort: "string"},
                    {id: "allotDate", header: "分配日期", width: 100, format: webix.Date.dateToStr("%Y-%m-%d")},
                    {id: "remark", header: "备注", sort: "string", fillspace: 1}
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
                    url: webix.proxy('customProxy','/policeDog/services/alot/list/getList/1000000/1'),
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
            {
                rows: [
                    {
                        view: "form",
                        css: "toolbar",
                        paddingY: 5,
                        paddingX: 10,
                        height: 36,
                        cols: [
                            {view: "button", label: "新建", width: 70, click: Actions.add},
                            {view: "button", label: "删除", width: 70, click: Actions.delete},
                            {},
                            {view: "button", label: "导出数据", width: 80, click: exportData}
                        ]
                    },
                    {
                        id: datatableId,
                        view: "datatable",
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
                                template: function (item) {
                                    return '<a class="my_link edit" href="javascript:void(0)"><span class="webix_icon icon fa-pencil-square-o"></span></a>';
                                },
                                tooltip: '编辑',
                                width: 55
                            },
                            {id: "dogName", header: "警犬名称", width: 100, sort: "string"},
                            {id: "breed", header: "品种", width: 90, sort: "string"},
                            {id: "hairType", header: "芯片号", width: 100, sort: "string"},
                            {id: "dogColor", header: "出生日期", width: 100, sort: "string", format: webix.Date.dateToStr("%Y-%m-%d")},
                            {id: "sex", header: "性别", width: 60, sort: "string"},
                            {id: "owner", header: "训导员", width: 100, sort: "string"},
                            {id: "workUnit", header: "所属单位", width: 120, sort: "string"},
                            {id: "allotDate", header: "分配日期", width: 100, format: webix.Date.dateToStr("%Y-%m-%d")},
                            {id: "remark", header: "备注", sort: "string", fillspace: 1},
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
                            edit: Actions.update
                        },
                        tooltip:true,
                        minHeight: 80,
                        datafetch: 20,//default
                        customUrl: {
                            url: webix.proxy('customProxy','/policeDog/services/alot/list/getList/{pageSize}/{curPage}'),
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
            }
        ]
    };

    return {
        $ui: {
            type: "space",
            rows: [
                {rows: [searchForm, datatable]}
            ]
        }
    };
});