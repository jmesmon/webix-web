define([
    'views/common/columns',
    'views/common/tickout',
    'views/common/editDogInfo'
], function (columns, tickout, editDog) {
    var cols = columns.getColumns( //"窝编号",
        ["犬名"],
        [{
            id: "id",
            header: "操作",
            template: '<div align="center"><a class="my_link edit" href="javascript:void(0)"><span class="webix_icon icon fa-pencil-square-o"></span></a></div>',
            tooltip: '编辑',
            width: 48
        }]
    );
    var cssFormat = function (height) {
        return function(){
            // return {};//{height: height + 'px !important'}
            return {}
        }
    };

    return {
        rows: [
            {
                view: "datatable",
                select: false,

                rowHeight: 70,
                // autoheight:true,
                // css: 'tab',
                columns: [
                    {
                        id: "$check",
                        header: {content: "masterCheckbox"},
                        checkValue: true,
                        uncheckValue: false,
                        template: "{common.checkbox()}",
                        width: 40
                    },
                    {id: "$index", header: "NO.", width: 45},
                    {header: '', fillspace: 1, css: 'tab', template: function(item){
                        return '<div style="height: 50px">22<br>dioi8<br>dioi8<br>dioi8</div>';
                    }}
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
                        editDog.openEdit('');
                    }
                },
                tooltip:true,
                minHeight: 80,
                datafetch: 20,//default
                customUrl: {
                    // autoload: true,
                    url: webix.proxy('customProxy','/policeDog/services/dogBaseInfo/getAll/{pageSize}/{curPage}'),
                    httpMethod: 'post',
                    params: {growthStage: 1},
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
    };
});