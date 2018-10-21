define([
], function () {
    var gridPager = function(newsType) {
        var pageId = webix.uid().toString();
        var tableId = webix.uid().toString();
        return {
            rows: [
                {
                    id: tableId,
                    view: "datatable",
                    columns: [
                        {id: "$index", header: "NO.", width: 45},
                        {id: "newsType", header: "分类", width: 100},
                        {
                            id: "title",
                            header: "新闻标题",
                            template: '<a href="javascript:void(0);" class="showDetail">#title#</a>',
                            fillspace: 1
                        },
                        {id: "publishDate", header: "发布日期", width: 120, format: webix.Date.dateToStr("%Y-%m-%d")},
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
                            var item = $$(tableId).getItem(b.row);
                            window.pageParams = item;
                            this.$scope.show('news.edit');
                        },
                        showDetail: function (e, obj) {
                            var item = $$(tableId).getItem(obj.row);
                            sessionStorage.setItem("newId", item.id);
                            window.open('#!/app/news.detail:id=' + item.id, '_self');
                        }
                    },
                    tooltip: true,
                    minHeight: 80,
                    datafetch: 20,//default
                    customUrl: {
                        url: webix.proxy('customProxy', '/policeDog/services/news/getList/{pageSize}/{curPage}'),
                        httpMethod: 'post',
                        datatype: 'customJson',
                        params: {newsType: newsType}
                    },
                    pager: pageId
                },
                {
                    view: "pager",
                    id: pageId,
                    size: 20,
                    group: 5,
                    template: "{common.first()}{common.prev()}{common.pages()}{common.next()}{common.last()}<div style='float: right'>总共#count#条</div>"
                }
            ]
        }
    };


    var datatable = {
        type: "clean",
        rows: [
            {
                view: 'tabbar',
                id: 'tabbar11',
                multiview: true,
                animate: true,
                options: [
                    {value: '通知公告', id: 'tab_new1', width: 120},
                    {value: '动态新闻', id: 'tab_new2', width: 120}
                ]
            },
            {
                cells: [
                    {
                        id: 'tab_new1',
                        // template: '1'
                        rows: [gridPager('通知公告')]
                    },

                    {
                        id: 'tab_new2',
                        // template: '2'
                        rows: [gridPager('动态新闻')]
                    }
                ]
            }
        ]
    };



    return {
        $ui: {
            type: "space",
            rows: [ datatable ]
        },
        $oninit: function () {
            var newType = localStorage.getItem("newType");
            if(newType == 1){
                $$('tabbar11').setValue('tab_new2');
            }
        }
    };
});