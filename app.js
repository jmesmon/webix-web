/*
	App configuration
*/

define([
	"libs/core",
	"helpers/menu",
	"helpers/locale",
	"helpers/theme",
	"libs/rollbar"
], function(core, menu, locale, theme, tracker){
	//webix.codebase = "libs/webix/";
	//CKEditor requires full path
	webix.codebase = document.location.href.split("#")[0].replace("index.html","")+"libs/webix/";

	if(!webix.env.touch && webix.ui.scrollSize && webix.CustomScroll)
		webix.CustomScroll.init();

	//configuration
	var app = core.create({
		id:			"app-police_dog",
		name:		"北京市公安局警犬技术工作管理与实战应用系统",
		version:	"0.1",
		debug:		true,
		start:		"/app/dashboard"		
	});

	app.use(menu);
	app.use(locale);
	app.use(theme);


	return app;
});

webix.i18n.locales["zh-CN"] = {
    groupDelimiter:",",
    groupSize:3,
    decimalDelimiter:".",
    decimalSize:2,
    dateFormat:"%Y-%m-%j",
    timeFormat:"%G:%i",
    longDateFormat:"%Y-%m-%j",
    fullDateFormat:"%Y-%m-%j %H:%i:%s",
    am:["上午","上午"],
    pm:["下午","下午"],
    price:"¥{obj}",
    priceSettings:{
        groupDelimiter:",",
        groupSize:3,
        decimalDelimiter:".",
        decimalSize:2
    },
    calendar:{
        monthFull:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
        monthShort:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
        dayFull:["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
        dayShort:["周日","周一","周二","周三","周四","周五","周六"],
        hours: "小时",
        minutes: "分钟",
        done:"完成",
        clear: "清除",
        today: "今天"
    },

    controls:{
        select:"选择",
        invalidMessage: "无效的输入值"
    },
    dataExport:{
        page:"页",
        of:"从"
    },
    PDFviewer:{
        of:"从",
        automaticZoom:"自动设置页面大小",
        actualSize:"实际尺寸",
        pageFit:"页面大小",
        pageWidth:"页面宽度",
        pageHeight:"页面高度"
    },
    aria:{
        calendar:"日历",
        increaseValue:"增加值",
        decreaseValue:"减少值",
        navMonth:["上个月", "下个月"],
        navYear:["上年", "明年"],
        navDecade:["过去十年", "下个十年"],
        dateFormat:"%Y'年'%m'月'%j'日'",
        monthFormat:"%Y'年'%m'月",
        yearFormat:"%Y'年",
        hourFormat:"小时: %G",
        minuteFormat:"分钟: %i",
        removeItem:"删除元素",
        pages:["第一页", "上一页", "下一页", "最后一页"],
        page:"页",
        headermenu:"标题菜单",
        openGroup:"打开栏目组",
        closeGroup:"关闭栏目组",
        closeTab:"关闭标签",
        showTabs:"显示更多选项卡",
        resetTreeMap:"回到原来的视图",
        navTreeMap:"升级",
        nextTab:"下一个标签",
        prevTab:"前一个标签",
        multitextSection:"加元",
        multitextextraSection:"删除元素",
        showChart:"显示图表",
        hideChart:"隐藏图表",
        resizeChart:"调整图"
    },
    richtext:{
        underline: "强调",
        bold: "粗體",
        italic: "斜体"
    },
    combo:{
        selectAll:"全选",
        unselectAll:"全部取消选择"
    }
};
webix.i18n.setLocale('zh-CN');