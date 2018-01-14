define([
    'views/common/constant',
    'views/user/userInfoForm',
], function (constant, userInfoForm) {


    return {
        $ui: {
            view: 'scrollview',
            body: {
                cols: [
                    {width: 100, borderless: true},
                    userInfoForm.getForm(true),
                    {borderless: true}
                ]
            }
        },
        $oninit: function () {
            $$('user_form').setValues(USER_INFO);
        }
    };
});