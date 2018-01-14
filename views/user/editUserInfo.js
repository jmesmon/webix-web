define([
    'views/common/constant',
    'views/user/userInfoForm',
], function (constant, userInfoForm) {


    return {
        $ui: userInfoForm,
        $oninit: function () {
            $$('user_form').setValues(USER_INFO);
            console.log(USER_INFO.policeName);
            console.log($$('user_form').getValues().policeName);
        }
    };
});