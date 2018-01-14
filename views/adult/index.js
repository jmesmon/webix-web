define([
    'views/adult/list_',
    'views/adult/searchForm'
], function (list, searchForm) {
    return {
        $ui: {
            type: "space",
            // type: "wide",
            rows: [
                searchForm,
                list
            ]
        }
    };
});