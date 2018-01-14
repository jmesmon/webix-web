define([], function () {
    return {
        rows: [
            {height: 100},
            {
                cols: [
                    {},
                    {
                        rows: [
                            {view:"text", label:"当前用户：", labelWidth: 90, labelAlign: 'right', width: 300, value: USER_INFO.policeName, readonly: true},
                            {view:"text", id: 'oldPwd', label:"旧密码：", labelWidth: 90, labelAlign: 'right', width: 300, value: '', type: 'password'},
                            {view:"text", id: 'newPwd', label:"新密码：", labelWidth: 90, labelAlign: 'right', width: 300, value: '', type: 'password'},
                            {view:"text", id: 'newPwd2', label:"重复新密码：", labelWidth: 90, labelAlign: 'right', width: 300, value: '', type: 'password'},

                            {
                                cols: [
                                    {width: 150},
                                    {view: "button", label: "修改密码", width: 80, click: function () {
                                        console.log(1221);
                                        var oldPwd = $$('oldPwd').getValue();
                                        var newPwd = $$('newPwd').getValue();
                                        var newPwd2 = $$('newPwd2').getValue();
                                        if(oldPwd.length == 0){
                                            msgBox('请输入旧密码');
                                            return ;
                                        }
                                        if(newPwd.length == 0){
                                            msgBox('请输入新密码');
                                            return ;
                                        }
                                        if(newPwd != newPwd2){
                                            msgBox('新密码两次输入不一致，请重新输入');
                                            return ;
                                        }
                                        doIPost('user/chgPwd', {password: oldPwd, passwordNew: newPwd}, function (data) {
                                            msgBox(data.message);
                                            if(data.success) {
                                                $$('oldPwd').setValue('');
                                                $$('newPwd').setValue('');
                                                $$('newPwd2').setValue('');
                                            }
                                        });
                                    }},
                                    {}
                                ]
                            }
                        ]
                    },
                    {},
                ]
            },
            {},
        ]
    };
});