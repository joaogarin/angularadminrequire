console.log('definition');

requirejs.config({
    paths: {
        // External libraries for running locally (non-minified versions)
        'angular': 'scripts/vendor/angular',
        'angular-route': 'scripts/vendor/angular-route.min',
        'angular-animate': 'scripts/vendor/angular-animate.min',
        'angular-ui-tree': 'scripts/vendor/angular-ui-tree',
        'angular-wizard': 'scripts/vendor/angular-wizard',
        'underscore': 'scripts/vendor/underscore-min',
        'chartjs': 'scripts/vendor/Chart.min',
        'flot': 'scripts/vendor/flot_compiled',
        'vmap': 'scripts/vendor/jquery.vmap.min',
        'vmap_calls': 'scripts/vendor/vmap_calls',
        'jquery': 'scripts/vendor/jquery-2.1.1.min',
        'raphael': 'scripts/vendor/raphael.min',
        'toastr': 'scripts/vendor/toastr.min',
        'morris': 'scripts/vendor/morris.min',
        'sparkline': 'scripts/vendor/sparkline',
        'easypiechart': 'scripts/vendor/easypiechart',
        'rocha': 'scripts/vendor/rocha',
        'extras': 'scripts/extras',
        'controllers': 'app/controllers',
        'directives': 'app/directives',
        'services': 'app/services'
    },
    waitSeconds: 0,

    baseUrl: '/angularAdmin',

    shim: {
        'angular': {'exports': 'angular'},
        'angular-route': {deps: ['angular']},
        'angular-animate': {deps: ['angular']},
        'angular-ui-tree': {deps: ['angular']},
        'angular-wizard': {deps: ['angular']},
        'extras': {deps: ['angular']},
        'easypiechart': {deps: ['angular']},
        'vmap': {deps: ['jquery']},
        'vmap_calls': {deps: ['vmap']},
        'flot': {deps: ['jquery']},
        'rocha': {deps: ['jquery']},
        'sparkline': {deps: ['jquery']},
        'morris': {deps: ['raphael']}
    }
});