define([
    "views/common/constant"
], function (constant) {
    var columns = {
        '窝编号': {id: "nestNo", header: "窝编号", width: 120, sort: "string"},
        '犬名': {id: "dogName", header: "犬名", width: 100},
        '芯片号': {id: "chipNo", header: "芯片号", width: 110},
        '芯片注入日期': {id: "chipNoInject", header: "芯片注入日期", width: 90, format: webix.Date.dateToStr("%Y-%m-%d")},
        '性别': {id: "sex", header: "性别", width: 60, template: function(obj){ return '<div align="center">' + (obj.sex == 1 ? '公' : '母') + '</div>'; } },
        '出生日期': {id: "birthday", header: "出生日期", width: 90, sort: "string", format: webix.Date.dateToStr("%Y-%m-%d")},
        '父亲芯片号': {id: "fatherId", header: "父亲芯片号", width: 90},
        '母亲芯片号': {id: "motherId", header: "母亲芯片号", width: 90},
        '品种': {id: "breed", header: "品种", width: 100, sort: "string"},
        '来源': {id: "dogSource", header: "来源", width: 60, sort: "string"},
        '毛色': {id: "dogColour", header: "毛色", width: 75, sort: "string"},
        '毛型': {id: "hairType", header: "毛型", width: 70, sort: "string"},
        '繁育员': {id: "breeder", header: "繁育员", width: 100, sort: "string"},
        '训导员': {id: "tutor", header: "训导员", width: 80},
        '专业名称': {id: "wormDesc", header: "专业名称", width: 100},
        '获得日期': {id: "wormDate", header: "获得日期", width: 85, format: webix.Date.dateToStr("%Y-%m-%d")},



        '窝编号_2':{id: "dogInfo.nestNo", header: "窝编号", width: 90, template: function(obj){ return obj.dogInfo.nestNo || ''; } },
        '犬名_2':{id: "dogInfo.dogName", header: "犬名", width: 90, template: function(obj){ return obj.dogInfo.dogName || ''; } },
        '芯片号_2':{id: "dogInfo.chipNo", header: "芯片号", width: 90, template: function(obj){ return obj.dogInfo.chipNo || ''; } },
        '芯片注入日期_2' :{id: "dogInfo.chipNoInject", header: "芯片注入日期", width: 85, template: function(item){
                return webix.Date.dateToStr("%Y-%m-%d")(item.dogInfo.chipNoInject);
            }},
        '性别_2' :{id: "dogInfo.sex", header: "性别", width: 50, template: function(obj){ return '<div align="center">' + (obj.dogInfo.sex == 1 ? '公' : '母') + '</div>'; } },
        '出生日期_2' :{id: "dogInfo.birthday", header: "出生日期", width: 85, sort: "string", template: function(item){
                return webix.Date.dateToStr("%Y-%m-%d")(item.dogInfo.birthday);
            }},
        '品种_2' :{id: "dogInfo.breed", header: "品种", width: 70, sort: "string", template: function(obj){ return obj.dogInfo.breed || ''; } },
        '来源_2' :{id: "dogInfo.dogSource", header: "来源", width: 50, sort: "string", template: function(obj){ return obj.dogInfo.dogSource || ''; } },
        '毛色_2' :{id: "dogInfo.dogColour", header: "毛色", width: 50, sort: "string", template: function(obj){ return obj.dogInfo.dogColour || ''; } },
        '毛型_2' :{id: "dogInfo.hairType", header: "毛型", width: 50, sort: "string", template: function(obj){ return obj.dogInfo.hairType || ''; } },
        '繁育员_2' :{id: "dogInfo.breeder", header: "繁育员", width: 80, sort: "string", template: function(obj){ return obj.dogInfo.breeder || ''; } },


        '类型': {id: "dogSource", header: "类型", width: 60, template: function(item){ var dic = {"1": "培训", "2": "复训", "3": "考核"}; return dic[item.trainStage] || '';}},
        '开始日期': {id: "trainStartDate", header: "开始日期", width: 85, format: webix.Date.dateToStr("%Y-%m-%d")},
        '结束日期': {id: "trainEndDate", header: "结束日期", width: 85, format: webix.Date.dateToStr("%Y-%m-%d")},
        '复训日期': {id: "trainDate", header: "复训日期", width: 85, format: webix.Date.dateToStr("%Y-%m-%d")},
        '考核日期': {id: "trainDate", header: "考核日期", width: 85, format: webix.Date.dateToStr("%Y-%m-%d")},
        '培训科目': {id: "trainName", header: "培训科目", width: 100},
        '班级名称': {id: "trainClassName", header: "班级名称", width: 100},
        '培训单位': {id: "trainUnit", header: "培训单位", width: 140},
        '培训地点': {id: "trainAddr", header: "培训地点", width: 200},
        // '教员': {id: "trainUser", header: "教员", width: 130},
        '基础评分': {id: "trainUser", header: "基础评分", width: 80, template: '<a class="score_detail">点击查看</a>'},
        '总分': {id: "totalScore", header: "总分", width: 80},
        '培训成绩': {id: "trainResult", header: "培训成绩", width: 80},
        '下次培训时间': {id: "nextTrainDate", header: "下次培训时间", width: 120, format: webix.Date.dateToStr("%Y-%m-%d")},
        '带犬民警': {id: "policeName", header: "带犬民警", width: 80},
        '教员': {id: "trainUser", header: "教员", width: 80},
        '工作单位': {id: "workUnit", header: "工作单位", width: 80},

    };
    var methods = {
        getDogInfo: function () {
            return [{
                id: "$check",
                header: {content: "masterCheckbox"},
                checkValue: true,
                uncheckValue: false,
                template: "{common.checkbox()}",
                width: 40
            },
                {header: '', fillspace: 1, css: 'tab', template: function(item){
                    try {
                        for(var n in item){
                            if(item[n] == null){
                                item[n] = '';
                            }
                        }
                        if(!item.dogPhoto){
                            if(constant.getDefaultTypeColor(item.breed)) {
                                item.dogPhoto = constant.getDefaultTypeColor(item.breed).photo;
                            }else{
                                item.dogPhoto = constant.getDefaultTypeColor("其他").photo;
                            }
                        }
                        try{
                            var age = new Date().getFullYear() - new Date(item.birthday).getFullYear();
                            if(age == 0){
                                var day = new Date().getTime() - new Date(item.birthday).getTime();
                                day = parseInt(day/1000/60/60/24);
                                age = day + '天';
                            }else{
                                age += '岁';
                            }
                            item.age = age;
                            item.birthday = item.birthday.split(' ')[0];
                        }catch(e){}
                        var mainPro = item.mainPro;
                        var dogPro = item.dogPros;
                        if(mainPro){
                            if(!dogPro){
                                dogPro = mainPro;
                            }else{
                                var ar = mainPro.split(',');
                                for(var m = 0; m<ar.length; m++){
                                    if(dogPro.indexOf(ar[m]) == -1){
                                        dogPro += "，" + ar[m];
                                    }
                                }
                            }
                        }

                        item.mergePro = dogPro;

                        var html = '<table width="100%">' +
                            '<tr style="height: 120px">' +
                            '<td style="width: 120px"><img src="#dogPhoto#" height="120" width="140"></td>' +
                            '<td>' +
                            '<div style="margin-top:-15px;padding-left: 6px">' +
                            '<table width="100%">' +
                            '<tr>' +
                            '<td style="width:350px">' +
                            '<div><span class="tab_label">犬&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</span>#dogName#</div>' +
                            '<div><span class="tab_label">品&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;种：</span>#breed#</div>' +
                            '<div><span class="tab_label">带犬民警：</span>#policeName#</div>' +
                            '<div><span class="tab_label">工作单位：</span>#workPlace#</div>'+
                            '</td>' +
                            '<td valign="top">' +
                            '<div><span class="tab_label">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;龄：</span>#age#（#birthday#）</div>' +
                            '<div><span class="tab_label">专业技能：</span>#mergePro#</div>' +
                            '<div><span class="tab_label">立功受奖：</span>#rewardInfo#</div>' +
                            '</td>' +
                            '</tr>' +
                            '</table>' +
                            '</div>' +
                            '</td>' +
                            '<td style="width: 80px"><span class="tab_detail">详细信息</span></td>' +
                            '</tr>' +
                            '</table>';
                        return webix.template(html)(item);// '<div style="height: 50px">22<br>dioi8<br>dioi8<br>dioi8</div>';
                    } catch (e) {
                        console.error(e);
                        location.reload();

                    }
                    return '';
                }}
            ];

        },
        getColumns: function (headers, startCols) {
            var cols = [
                {
                    id: "$check",
                    header: {content: "masterCheckbox"},
                    checkValue: true,
                    uncheckValue: false,
                    template: "{common.checkbox()}",
                    width: 40
                },
                {id: "$index", header: "NO.", width: 45}
            ];
            if(startCols){
                for(var i = 0; i<startCols.length; i++){
                    cols.push(startCols[i]);
                }
            }
            for(var i = 0; i<headers.length; i++){
                if(typeof(headers[i]) == 'object'){
                    cols.push(headers[i]);
                }else if(headers[i] != '芯片注入日期') {
                    cols.push(methods.get(headers[i]));
                }
            }
            return cols;
        },
        get: function (name) {
            return columns[name];
        }
    };
    return methods;
});