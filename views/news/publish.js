define([], function () {
    return {
        $ui: {
            type: "space",
            rows: [
                {
                    cols: [
                        {
                            width: 410,
                            rows: [
                                {view: "text", label: "标题：", name: "title", id: 'ntitle', width: 400, labelWidth: 55, labelAlign: 'right'}
                            ]
                        },
                        {
                            view: "richselect", label: "分类：", width: 150, id: 'ntype', name: 'orgArea', labelAlign: 'right',labelWidth: 55, value: '动态新闻',
                            options: [
                                {id: '动态新闻', value: '动态新闻'},
                                {id: '通知公告', value: '通知公告'},
                            ]
                        },
                        {view: "datepicker", label: "发布日期：", name: "date", id: 'ndate', labelWidth: 70, width: 180, value: new Date(), labelAlign: 'right', format:"%Y-%m-%d", stringResult: true},
                        {view: 'text', label: '工作单位：', id: 'nworkUnit', value: USER_INFO.workUnit, readonly: true, labelAlign: 'right',labelAlign: 'right'},
                        {},
                    ]
                },

                {
                    height: 400,
                    borderless: true,
                    view:"iframe", id:"content-body", src:"news/publish.html", on: {
                        onAfterLoad: function(){
                        }
                    }
                },
                {
                    cols: [
                        {},
                        {view: "button", label: "发布", type: "form", width: 90, click: function () {
                            var title = $$('ntitle').getValue();
                            var date = $$('ndate').getValue();
                            var content = $$('content-body').getWindow().getAllHtml();
                            doIPost('news/add', {
                                title: title,
                                workUnit: $$('nworkUnit').getValue(),
                                newsType: $$('ntype').getValue(),
                                publishDateStr: date,
                                content: content,
                                publisher: USER_INFO.policeName,
                                // newsType: '',
                            }, function (data) {
                                if(data.success){
                                    msgBox("发布成功");
                                    window.open('#!/app/news.list', '_self');
                                }else{
                                    msgBox("发布失败")
                                }
                            });
                        }},
                        {},
                    ]
                },
                {},
            ]
        }
    };
});