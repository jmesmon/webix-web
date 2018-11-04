define([
    'views/common/constant',
    'views/workSum/action',
], function ( constant, actions) {
    var datatableId = webix.uid().toString();
    var formId = webix.uid().toString();
    var Actions = actions.getActions(datatableId, formId);

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
                                {
                                    view: "richselect", label: "工作类型", name: 'workType',  width: 210, value: '搜爆安检', labelWidth: 70,
                                    options: [
                                        {id: '搜爆安检', value: '搜爆安检'},
                                        {id: '治安防范', value: '治安防范'},
                                        {id: '其他（备勤）', value: '其他（备勤）'},
                                        {id: '刑侦侦查', value: '刑侦侦查'}
                                    ]
                                },
                                {view: "datepicker", label: "出勤日期", name: "startTimeStr",labelWidth: 70, width: 190, format:"%Y-%m-%d", stringResult: true},
                                {view: "datepicker", label: "-", name: "endTimeStr", labelWidth: 15, width: 135, format:"%Y-%m-%d", stringResult: true},
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
    webix.ui({
        view:"popup",
        id:"my_pop",
        width: 150,
        body:{
            view:"list",
            data:[ {id:"搜爆安检", name:"搜爆安检"},
                {id:"治安防范", name:"治安防范"},
                {id:"其他（备勤）", name:"其他（备勤）"},
                {id:"刑侦侦查", name:"刑侦侦查"}
            ],
            on:{
                onItemClick: function(id){
                    $$('my_pop').hide();
                    Actions.add(id);
                }
            },
            datatype:"json",
            template:"#name#",
            autoheight:true
        }
    });
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
                            {view: "button", label: "添加", width: 70, popup:"my_pop"},
                            {view: "button", label: "删除", width: 70, click: Actions.delete},
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
                                    return '<a class="my_link edit" href="javascript:void(0)"><span class="webix_icon icon fa-pencil-square-o"></span></a>';
                                },
                                tooltip: '编辑',
                                width: 55
                            },
                            {id: 'workType', header: "工作类型", width: 120},
                            {id: 'dateStart', header: "开始时间", width: 100},
                            {id: 'dateEnd', header: "结束时间", width: 100},
                            //搜爆安检
                            {batch: 'sbaj', header: "出勤次数", fillspace: 1, template: function(item){ return item.attQty || 0;} },
                            {batch: 'sbaj', header: "出勤人数", fillspace: 1, template: function(item){ return item.attPerQty || 0;} },
                            {batch: 'sbaj', header: "出勤犬数", fillspace: 1, template: function(item){ return item.attDogQty|| 0;}},
                            {batch: 'sbaj', header: "安检面积", fillspace: 1, template: function(item){ return item.checkArea|| 0;}},
                            {batch: 'sbaj', header: "安检车辆数", fillspace: 1, template: function(item){ return item.checkCarQty|| 0;}},
                            {batch: 'sbaj', header: "查获违禁品数", fillspace: 1, template: function(item){ return item.wjpQty|| 0;}},
                            {batch: 'sbaj', header: "查获毒品", fillspace: 1, template: function(item){ return item.dpQty|| 0;}},

                            //治安防范
                            {batch: 'zaff', header: "巡逻次数", fillspace: 1, template: function(item){ return item.attQty|| 0;}, hidden: true},
                            {batch: 'zaff', header: "出勤人数", fillspace: 1, template: function(item){ return item.attPerQty|| 0;}, hidden: true},
                            {batch: 'zaff', header: "出勤犬数", fillspace: 1, template: function(item){ return item.attDogQty|| 0;}, hidden: true},
                            {batch: 'zaff', header: "巡逻时长", fillspace: 1, template: function(item){ return item.workHours|| 0;}, hidden: true},
                            {batch: 'zaff', header: "查获违禁品数", fillspace: 1, template: function(item){ return item.wjpQty|| 0;}, hidden: true},
                            {batch: 'zaff', header: "查获毒品", fillspace: 1, template: function(item){ return item.dpQty|| 0;}, hidden: true},

                            //其他（备勤）
                            {batch: 'bq', header: "备勤次数", fillspace: 1, template: function(item){ return item.attQty|| 0;}, hidden: true},
                            {batch: 'bq', header: "出勤人数", fillspace: 1, template: function(item){ return item.attPerQty|| 0;}, hidden: true},
                            {batch: 'bq', header: "出勤犬数", fillspace: 1, template: function(item){ return item.attDogQty|| 0;}, hidden: true},
                            {batch: 'bq', header: "备勤时长", fillspace: 1, template: function(item){ return item.workHours|| 0;}, hidden: true},
                            {batch: 'bq', header: "查获违禁品数", fillspace: 1, template: function(item){ return item.wjpQty|| 0;}, hidden: true},
                            {batch: 'bq', header: "查获毒品", fillspace: 1, template: function(item){ return item.dpQty|| 0;}, hidden: true},

                            //刑侦侦查
                            {batch: 'xzzc', header: "出勤次数", fillspace: 1, template: function(item){ return item.attQty|| 0;}, hidden: true},
                            {batch: 'xzzc', header: "出勤人数", fillspace: 1, template: function(item){ return item.attPerQty|| 0;}, hidden: true},
                            {batch: 'xzzc', header: "出勤犬数", fillspace: 1, template: function(item){ return item.attDogQty|| 0;}, hidden: true},
                            {batch: 'xzzc', header: "破案数", fillspace: 1, template: function(item){ return item.paQty|| 0;}, hidden: true},
                            {batch: 'xzzc', header: "查获违禁品数", fillspace: 1, template: function(item){ return item.wjpQty|| 0;}, hidden: true},
                            {batch: 'xzzc', header: "查获毒品", fillspace: 1, template: function(item){ return item.dpQty|| 0;}, hidden: true}
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
                            url: webix.proxy('customProxy','/policeDog/services/work/getWorkSumList/{pageSize}/{curPage}'),
                            httpMethod: 'post',
                            datatype: 'customJson',
                            params: {workUnit: USER_INFO.workUnit, workType: '搜爆安检'}
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