define([
	"views/modules/dashline",
	"views/modules/visitors",
	"views/modules/orders",
	"views/modules/messages",
	"views/modules/revenue",
	"views/modules/tasks",
	"views/modules/map"
],function(dashline, visitors, orders, messages, revenue, tasks, map){
	
	var layout = {
		type: "clean",
		rows:[
			dashline,
			{
				type: "space",
				rows:[
					{
						type: "wide",
						cols: [
							messages,
							revenue

						]
					},
					{
						type: "wide",
						cols: [
							tasks,
							map
						]
					}
				]

			}
		]
	};

	return {
		$ui: {
            css: 'dashboard',
            id: 'dashboard',
			rows: [{
                css: 'load_page_border',
				id: 'loading_logo',
                rows: [
					{},
					{
						borderless: true,
						template: '<div align="center" style=""><img src="assets/imgs/loading.gif" height="55px" width="55px"></div>'
					},
					{}
				]
            },{
            	height: 1,
                view:"iframe", id:"frame-body", src:"views/portal.html", on: {
                    onAfterLoad: function(){
                    	$$('frame-body').define('height', null);
                    	$$('loading_logo').hide();
					}
				}
				// template: '<div style="background: red">ssss</div>'
			}]
		},
        $oninit: function (view, scope) {
			// var dom = $$('dashboard').getNode();
			// dom.style.background = 'red';
            // console.log(dom);
        }

	};

});