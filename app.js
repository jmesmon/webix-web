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