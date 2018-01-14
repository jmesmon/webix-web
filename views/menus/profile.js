define(function(){

return {
	$ui:{
		view: "submenu",
		id: "profilePopup",
		css: 'profile',
		width: 150,
		padding:0,
		data: [
			{id: 1, icon: "user", value: "个人信息"},
			{id: 2, icon: "cog", value: "修改密码"},
			{ $template:"Separator" },
			{id: 4, icon: "sign-out", value: "退出系统"}
		],
        on: {
            onItemClick: function (id, e, el) {
                if(id == 1) {
                    window.open('#!/app/user.profile', '_self');
                }else if(id == 2){
					window.open('#!/app/user.password', '_self');
				}else if(id == 4){
                    sessionStorage.removeItem('_user_info_');
                    checkLogin();
				}
            }
        },
		type:{
			template: function(obj){
				if(obj.type)
					return "<div class='separator'></div>";
				return "<span class='webix_icon alerts fa-"+obj.icon+"'></span><span>"+obj.value+"</span>";
			}
		}

	}
};

});