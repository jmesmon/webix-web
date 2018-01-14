define(function(){

	var checkPermission = function(item){
		var hasPermission = false;
        if(item.permission){
            if(window.permissions.indexOf(item.permission) != -1){
                hasPermission = true;
            }
        }else{
            hasPermission = true;
        }
        return hasPermission;
	};
	var allData = [
        { id: "dashboard", value: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;首页", icon: "", details: "" },

        {id: "work", value: "警犬使用", open: true,  data:[
            { id: "adult.work", value: "警犬工作管理", permission: 'work', icon: "flag-o", $css: "products", details:""},
        ]},

        {id: "train", open: true, value:"培训管理", data:[
            { id: "train.publish", value: "培训发布管理", permission: 'train.publish', icon: "pencil", $css: "products", details:""},
            { id: "train.createTrain", value: "报名培训", permission: 'train.create', icon: "file-text", $css: "products", details:""},
            // { id: "train.scoreMgmt", value: "培训成绩管理", permission: 'train.score.mgmt', icon: "check-square-o", $css: "products", details:""},
            { id: "train.trainSocre", value: "警犬培训", permission: 'train.myList', icon: "list", $css: "products", details:""},
            // { id: "train.profession", value: "专业技能", permission: 'train.prof', icon: "list-alt", $css: "products", details:""},
        ]},

        {id: "apply", open: true, value:"配发管理", data:[
            { id: "apply.list", value: "申请配发", permission: 'apply.dog', icon: "table", $css: "products", details:""},
            { id: "adult.allot", value: "警犬调配", permission: 'apply.dog', icon: "table", $css: "products", details:""},
        ]},

        {id: "main", value: "繁育管理", permission: 'breed', open: true, data:[
            { id: "breed.mating", value: "交配管理", icon: 'venus-mars', $css: "dashboard", details:""},
            // { id: "breed.index", value: "警犬繁殖", icon: 'venus-mars', $css: "dashboard", details:""},
            { id: "youngDog.index", value: "幼犬管理", icon: "github-alt", $css: "orders", details:""},

            { id: "wormImmue.worm", value: "驱虫管理", icon: "bug", details: "" },
            { id: "wormImmue.immue", value: "免疫管理", icon: "eyedropper", details: ""}
        ]},


        {id: "dogMgmt", value: "警犬管理", open: true, data:[
            { id: "adult.adultList", value: "警犬列表", permission: 'dog.list', icon: 'list', $css: "dashboard", details:""},
            { id: "adult.addDog", value: "警犬信息录入", permission: 'dog.addDog', icon: "plus", details: "" },
            { id: "apply.tickoutList", value: "淘汰申请", permission: 'apply.tickout.list', icon: "list", details: "" },
            { id: "apply.dieList", value: "死亡报告", permission: 'apply.die.list', icon: "list", details: "" },
        ]},

        {id: "news", open: true, value:"宣传模块", data:[
            { id: "news.publish", value: "动态发布", permission:'news.publish', icon: "pencil", $css: "products", details:""},
            { id: "news.list", value: "动态管理", permission: 'news.list', icon: "list", $css: "products", details:""},
        ]},
        {id: "reporter", open: true, value:"报表中心", data:[
            { id: "reporter.export", value: "报表导出", permission: 'org.config', icon: "list", $css: "products", details:""},
        ]},

        {id: "sysConfig", open: true, value:"系统设置", data:[
            { id: "user.list", value: "人员管理", permission: 'org.user', icon: "list", $css: "products", details:""},
            { id: "system.orgConfig", value: "单位信息", permission: 'org.config', icon: "list", $css: "products", details:""},
        ]},
        {id: "user", open: true, value:"个人中心", anyone:true, data:[
            { id: "user.profile", value: "个人信息", permission: 'news.list', icon: "list", $css: "products", details:""},
            { id: "user.password", value: "修改密码", permission: 'news.list', icon: "list", $css: "products", details:""},
        ]},

        { id: "news.detail", value: "&nbsp;&nbsp;&nbsp;", icon: "", details: "", hidden: true},
    ];

	var data = [];
	for(var i = 0; i<allData.length; i++){
		var item = allData[i];
		if(item.anyone){
		    data.push(item);
		    continue;
        }
		var hasPermission = checkPermission(item);
		if(hasPermission) {
            var children = [];
            if (item.data) {
                for (var j = 0; j < item.data.length; j++) {
                    var ci = item.data[j];
                    if (checkPermission(ci)) {
                        children.push(ci);
                    }
                }
            }
            if (children.length > 0 || !item.data) {
                item.data = children;
                data.push(item);
            }
        }
	}

	return {
		$ui:{
			width: 200,
			id: 'left_menu',
			rows:[
				{
					view: "tree",
					id: "app:menu",
					type: "menuTree2",
					css: "menu",
					activeTitle: true,
					select: true,
					tooltip: {
						template: function(obj){
							return obj.$count?"":obj.details;
						}
					},
					on:{
						onBeforeSelect:function(id){
							if(this.getItem(id).$count){
								return false;
							}
						},
						onAfterSelect:function(id){
							var item = this.getItem(id);
							this.$scope.show("./"+id);
							webix.$$("title").parse({title: item.value, details: item.details});
						}
					},
					data: data
				}
			]
		}
	};

});
