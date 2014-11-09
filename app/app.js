
/**************************
 Initialize the Angular App
 **************************/

define(['angular',
    'angular-route',
    'angular-animate',
    'angular-ui-tree',
    'angular-wizard',
    'underscore',
    'controllers',
    'directives',
    'services']
    ,function(_){

        console.log("enter app def");

    var app = angular.module("app", ["ngRoute", "ngAnimate", "ui.bootstrap", "easypiechart", "mgo-angular-wizard", "textAngular", "ui.tree", "ngMap", "ngTagsInput", "app.ui.ctrls", "app_ui_services", "app.controllers", "app.directives", "app.form.validation", "app.ui.form.ctrls", "app.ui.form.directives", "app.tables", "app.map", "app.task", "app.chart.ctrls", "app.chart.directives","countTo"]).config(["$routeProvider",
        function($routeProvider) {
            return $routeProvider.when("/", {
                redirectTo: "/dashboard"
            }).when("/dashboard", {
                    templateUrl: "app/views/dashboard.html"
                }).when("/ui/typography", {
                    templateUrl: "app/views/ui_elements/typography.html"
                }).when("/ui/buttons", {
                    templateUrl: "app/views/ui_elements/buttons.html"
                }).when("/ui/icons", {
                    templateUrl: "app/views/ui_elements/icons.html"
                }).when("/ui/grids", {
                    templateUrl: "app/views/ui_elements/grids.html"
                }).when("/ui/widgets", {
                    templateUrl: "app/views/ui_elements/widgets.html"
                }).when("/ui/components", {
                    templateUrl: "app/views/ui_elements/components.html"
                }).when("/ui/timeline", {
                    templateUrl: "app/views/ui_elements/timeline.html"
                }).when("/ui/nested-lists", {
                    templateUrl: "app/views/ui_elements/nested-lists.html"
                }).when("/forms/elements", {
                    templateUrl: "app/views/forms/elements.html"
                }).when("/forms/layouts", {
                    templateUrl: "app/views/forms/layouts.html"
                }).when("/forms/validation", {
                    templateUrl: "app/views/forms/validation.html"
                }).when("/forms/wizard", {
                    templateUrl: "app/views/forms/wizard.html"
                }).when("/maps/gmap", {
                    templateUrl: "app/views/maps/gmap.html"
                }).when("/maps/jqvmap", {
                    templateUrl: "app/views/maps/jqvmap.html"
                }).when("/tables/static", {
                    templateUrl: "app/views/tables/static.html"
                }).when("/tables/responsive", {
                    templateUrl: "app/views/tables/responsive.html"
                }).when("/tables/dynamic", {
                    templateUrl: "app/views/tables/dynamic.html"
                }).when("/charts/others", {
                    templateUrl: "app/views/charts/charts.html"
                }).when("/charts/morris", {
                    templateUrl: "app/views/charts/morris.html"
                }).when("/charts/chartjs", {
                    templateUrl: "app/views/charts/chartjs.html"
                }).when("/charts/flot", {
                    templateUrl: "app/views/charts/flot.html"
                }).when("/mail/inbox", {
                    templateUrl: "app/views/mail/inbox.html"
                }).when("/mail/compose", {
                    templateUrl: "app/views/mail/compose.html"
                }).when("/mail/single", {
                    templateUrl: "app/views/mail/single.html"
                }).when("/pages/features", {
                    templateUrl: "app/views/pages/features.html"
                }).when("/pages/signin", {
                    templateUrl: "app/views/pages/signin.html"
                }).when("/pages/signup", {
                    templateUrl: "app/views/pages/signup.html"
                }).when("/pages/forgot", {
                    templateUrl: "app/views/pages/forgot-password.html"
                }).when("/pages/profile", {
                    templateUrl: "app/views/pages/profile.html"
                }).when("/404", {
                    templateUrl: "app/views/pages/404.html"
                }).when("/pages/500", {
                    templateUrl: "app/views/pages/500.html"
                }).when("/pages/blank", {
                    templateUrl: "app/views/pages/blank.html"
                }).when("/pages/contact", {
                    templateUrl: "app/views/pages/contact.html"
                }).when("/tasks", {
                    templateUrl: "app/views/tasks/tasks.html"
                }).otherwise({
                    redirectTo: "/404"
                });
        }
    ]);

    return app;

});