define([
    'views/common/constant',
    'views/common/columns'
], function (constant, columnsDef) {
    var formId, datatableId;

    var action = {
        init: function (formId, datatableId) {
            formId = formId;
            datatableId = datatableId;
        },
        doSearch: function (formId, datatableId) {
            console.log(formId);
        }
    };

    return action;
})