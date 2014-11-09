
console.log("Before enter main");

define(['app/app'], function (app) {
    'use strict';

    console.log("app main js");

    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        angular.bootstrap(document.documentElement, [app.name]);

    } else {
        document.onreadystatechange = function () {
            if (document.readyState === 'interactive') {
                angular.bootstrap(document.documentElement,  [app.name]);
            }
        };
    }
});