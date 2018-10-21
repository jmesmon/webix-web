define([
    'views/common/columns',
    'views/common/tickout',
    'views/common/editDogInfo',
    'views/common/constant',
    'views/allotList/action',
], function (columns, tickout, editDog, constant, Actions) {
    var datatableId = webix.uid().toString();
    var formId = webix.uid().toString();
    Actions.init(formId, datatableId);

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
                id: 'form',
                elementsConfig: {
                    labelWidth: 90
                },
                elements: [
                    {
                        rows: [{
                            cols: [
                                {view: "text", label: "警犬名称", name: "dogNameLike", width: 180, labelWidth: 70, placeholder: '支持搜索'},
                                {width: DEFAULT_PADDING},
                                {
                                    view: "richselect", label: "工作单位", name: 'workPlace',  width: 170, value: '-1', labelWidth: 70,
                                    options: constant.getUnitOptions(true)
                                },
                                {width: DEFAULT_PADDING},
                                {view: "text", label: "警犬芯片号", name: "chipNoLike", width: 180, labelWidth: 80, placeholder: '支持搜索'},
                                {width: DEFAULT_PADDING},
                                {view: "text", label: "警犬专业", name: "mainProLike", width: 180, labelWidth: 70},
                                {width: DEFAULT_PADDING},
                                {view: "button", label: "清空", type: "form", width: 70, paddingX: 10, click: function(){
                                        $$('form').clear();
                                    }},
                                {view: "button", label: "查找", type: "form", width: 70, paddingX: 10, click: function(){
                                    Actions.doSearch('form', datatableId);
                                }},
                                {}
                            ]
                        }]
                    }
                ]
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
            {
                rows: [
                    {
                        view: "form",
                        css: "toolbar",
                        paddingY: 5,
                        paddingX: 10,
                        height: 36,
                        cols: [
                            {view: "button", label: "新建申请", width: 70,},
                            {view: "button", label: "批量审批", width: 70, permission: 'apply.dog.approve'},
                            {view: "button", label: "删除", width: 70},
                            {}
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
                                    if(item.applyState == 1 || item.applyState == 3){
                                        return '<a class="my_link edit" href="javascript:void(0)"><span class="webix_icon icon fa-pencil-square-o"></span></a>';
                                    }else{
                                        return '';//<span class="webix_icon icon fa-pencil-square-o"></span>'
                                    }
                                },
                                tooltip: '编辑',
                                width: 55
                            },
                            {id: "creationDate", header: "申请日期", width: 94, format: webix.Date.dateToStr("%Y-%m-%d") },
                            {id: "workUnit", header: "申请单位", width: 90, sort: "string"},
                            {id: "applyAmount", header: "数量", width: 60, sort: "string"},
                            {id: "applyState", header: "审批状态", width: 140, template: function(obj, common, value){
                                    return {
                                        "1": "待审批",
                                        "2": "审批通过，待配发",
                                        "3": "申请驳回",
                                        "4": "配发完成"}[value] || "";
                                }},
                            {id: "lastUpdateDate", header: "审批日期", width: 94, format: webix.Date.dateToStr("%Y-%m-%d")},
                            {id: "approveDetail", header: "审批日志", width: 110},
                            {id: "applyDesc", header: "备注", sort: "string", fillspace: 1},
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