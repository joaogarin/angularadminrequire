
/**************************
 App ui Services

 loggit - Creates a logit type message for all logging

 **************************/

define(['angular','toastr'],function(angular,toastr){

    angular.module("app_ui_services", []).factory("loggit", [
        function() {
            var logIt;
            return logIt = function(message, type) {
                return toastr[type](message);
            }, {
                log: function(message) {
                    logIt(message, "info");
                },
                logWarning: function(message) {
                    logIt(message, "warning");
                },
                logSuccess: function(message) {
                    logIt(message, "success");
                },
                logError: function(message) {
                    logIt(message, "error");
                }
            };
        }
    ]);

});

