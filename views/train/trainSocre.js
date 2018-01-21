define([
    "views/common/columns"
], function (column) {
    var datatableId = webix.uid().toString();

    var del = function(){
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        var arr = [],erroeArr = [];
        for(var i=0; i<data.length; i++){
            var item = data[i];
            if(item.trainResult){
                erroeArr.push(item);
            }else{
                arr.push(item);
            }
        }
        if(arr.length == 0){
            msgBox("设置成绩的培训不可以取消报名（删除）<br>您一共选择了"  + data.length + "条培训信息，均不符合取消报名条件");
            return ;
        }
        webix.confirm({
            text:"确定删除？删除不可恢复", ok:"是", cancel:"否",
            callback:function(res){
                if(res){
                    var w = loading();
                    var params = arr;
                    doPost('train/delete', arr, function(data){
                        w.close();
                        if(data.success){
                            datatable.reload();
                            webix.confirm({
                                text:"是否恢复下次培训日期？", ok:"是", cancel:"否",
                                callback:function(r){
                                    if(r){
                                        var par = [];
                                        for(var i = 0; i<params.length; i++){
                                            var it = params[i];
                                            var nt = new Date(it.nextTrainDate);
                                            var year = nt.getFullYear();
                                            nt = it.nextTrainDate.replace(year, year - 1);

                                            par.push({id: it.dogId, nextTrainDateStr: nt});
                                        }

                                        doPost('dogBaseInfo/update', par, function (d) {
                                            if(d.success){
                                                msgBox('操作成功')
                                            }else{
                                                msgBox('操作失败<br>' + data.message)
                                            }
                                        });
                                    }
                                }});
                        }else{
                            msgBox('操作失败<br>' + data.message)
                        }
                    });
                }
            }
        });
    };

    var setScore = function () {
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        if(data.length == 0){
            msgBox("请至少选择一条数据");
            return ;
        }
        var win = getWin("批量设置成绩", {
            rows: [{
                height: 30,
                borderless: true,
                template: '一共选择了'+data.length+'只警犬，请设置培训成绩'
            }, {
                view: "richselect", label: "培训成绩", id: 'trainResult', width: 200, value: '合格', labelWidth: 60,
                options: [
                    {id: '合格', value: "合格"},
                    {id: '优秀', value: "优秀"},
                    {id: '不合格', value: "不合格"},
                ]
            },
            {width: 400},
            {
                cols:[
                    {},
                    {view: "button", label: "取消", css: 'non-essential', width: 65, click: function () {
                        win.close();
                    }},
                    {width: DEFAULT_PADDING/2},
                    {view: "button", label: "提交", width: 65, click: function () {
                        var da = [];
                        var trainResult = $$('trainResult').getValue();
                        for(var i = 0; i<data.length; i++){
                            var nt = data[i].nextTrainDate;
                            try{
                                nt = nt.split(' ')[0]
                            }catch(e){}
                            da.push({id: data[i].id, trainResult: trainResult, nextTrainDateStr: nt, dogId: data[i].dogId});
                        }
                        doIPost('train/batchUpdate', da, function(res){
                            win.close();
                            if(res.success){
                                $$(datatableId).reload();
                            }else{
                                msgBox('操作失败<br>' + res.message)
                            }
                        });
                    }}
                ]
            }]
        }, {width: 400, height: 160});
        win.show();
    };
    var setProf = function(){
        var datatable = $$(datatableId);
        var data = datatable.getCheckedData();
        if(data.length == 0){
            msgBox("请至少选择一条数据");
            return ;
        }
        var win = getWin("批量赋予专业技能", {
            rows: [{
                height: 30,
                borderless: true,
                template: '一共选择了'+data.length+'只警犬，请按照培训结果赋予专业技能'
            },
                {view: "richselect", label: "专业技能名称", name: 'trainName', value:"", width: 270, labelWidth: 86,
                    options:[
                        {id: '追踪', value: "追踪"},
                        {id: '鉴别', value: "鉴别"},
                        {id: '物证搜索', value: "物证搜索"},
                        {id: '搜捕', value: "搜捕"},
                        {id: '治安防范', value: "治安防范"},
                        {id: '搜爆', value: "搜爆"},
                        {id: '搜毒', value: "搜毒"},
                        {id: '救援', value: "救援"},
                        {id: '其他', value: "其他"}
                    ]
                },
            // ,{
            //     view: "text", label: "专业技能名称", id: 'profName', width: 270, value: '', labelWidth: 86, attributes:{ maxlength: 16 }
            // },
                {width: 400},
                {
                    cols:[
                        {},
                        {view: "button", label: "取消", css: 'non-essential', width: 65, click: function () {
                            win.close();
                        }},
                        {width: DEFAULT_PADDING/2},
                        {view: "button", label: "提交", width: 65, click: function () {
                            var profData = [];
                            var profName = $$('profName').getValue();
                            if(profName == ''){
                                msgBox('专业技能不能为空');
                                return;
                            }
                            for(var i = 0; i<data.length; i++){
                                var item = data[i];
                                profData.push({dogId: item.dogId, profName: profName});
                            }
                            console.log(profData);
                            doIPost('profession/add', profData, function(res){
                                if(res.success){
                                    win.close();
                                    $$(datatableId).reload();
                                }else{
                                    msgBox('操作失败<br>' + res.message)
                                }
                            });
                        }}
                    ]
                }]
        }, {width: 400, height: 160});
        win.show();
    };

    /**
     * 执行搜索
     */
    var search = function () {
        var datatable = $$(datatableId);
        var params = $$('form').getValues();
        removeEmptyProperty(params);
        datatable.config.customUrl.params = params;
        datatable.reload();
    };

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
                    labelWidth: 60
                },
                elements: [
                    {
                        cols: [
                            {view: "text", label: "带犬民警", name: "policeName", width: 250},
                            {width: DEFAULT_PADDING},
                            {view: "text", label: "警犬名", name: "dogName", width: 250, labelWidth: 55},
                            {width: DEFAULT_PADDING},
                            {view: "button", label: "查找", type: "form", width: 100, paddingX: 10, click: search},
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

    var cols = column.getColumns([//"类型",
         "开始日期", "结束日期", "培训科目", "培训单位", "犬名_2", "带犬民警",  "培训成绩",  "教员", "工作单位", "下次培训时间", "培训地点"
    ], []);

    var gridPager = {
        rows: [
            {
                view: "form",
                css: "toolbar",
                paddingY: 5,
                paddingX: 10,
                height: 36,
                cols: [
                    // {view: "button", label: "添加", width: 70},
                    {view: "button", label: "设置成绩", width: 80, permission: 'train.myList.btn.setScore', click: setScore},
                    // {view: "button", label: "授予专业技能", width: 100, permission: 'train.myList.btn.setProf', click: setProf},
                    {view: "button", label: "取消报名（删除）", width: 120, permission: 'train.myList.btn.del', click: del},
                    {}
                ]
            },
            {
                id: datatableId,
                view: "datatable",
                select: false,
                columns: cols,
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
                    url: webix.proxy('customProxy','/policeDog/services/train/getList/{pageSize}/{curPage}'),
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
                {rows: [searchForm, datatable]}
            ]
        }
    };
});