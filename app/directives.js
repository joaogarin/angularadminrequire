
define(['angular',
    'underscore',
    'chartjs',
    'flot',
    'vmap',
    'vmap_calls',
    'sparkline',
    'easypiechart',
    'morris',
    'extras',
    'rocha',
    'services'],function(angular){


    /**************************
     Chart directives
     **************************/

    angular.module("app.chart.directives", []).directive("gaugeChart", [
            function() {
                return {
                    scope: {
                        gaugeData: "=",
                        gaugeOptions: "="
                    },
                    link: function(scope, ele) {
                        var data, gauge, options;

                        data = scope.gaugeData;
                        options = scope.gaugeOptions;

                        gauge = new Gauge(ele[0]).setOptions(options);
                        gauge.maxValue = data.maxValue;
                        gauge.animationSpeed = data.animationSpeed;
                        gauge.set(data.val);
                    }
                };
            }
        ]).directive('chart', function () {
            var baseWidth = 600;
            var baseHeight = 400;

            return {
                restrict: 'E',
                template: '<canvas></canvas>',
                scope: {
                    chartObject: "=value",
                    data: "="
                },
                link: function (scope, element, attrs) {
                    var canvas  = element.find('canvas')[0],
                        context = canvas.getContext('2d'),
                        chart;

                    var options = {
                        type:   attrs.type   || "Line",
                        width:  attrs.width  || baseWidth,
                        height: attrs.height || baseHeight
                    };
                    canvas.width = options.width;
                    canvas.height = options.height;
                    chart = new Chart(context);

                    var chartType = attrs.type;

                    chart[chartType](scope.data, options);

                    //Update when charts data changes
                    scope.$watch(function() { return scope.chartObject; }, function(value) {
                        if(!value) return;
                        var chartType = options.type;
                        chart[chartType](scope.chartObject.data, scope.chartObject.options);
                    });
                }
            };
        }).directive("flotChart", [
            function() {
                return {
                    restrict: "A",
                    scope: {
                        data: "=",
                        options: "="
                    },
                    link: function(scope, ele) {
                        var data, options, plot;
                        return data = scope.data, options = scope.options, plot = $.plot(ele[0], data, options);
                    }
                };
            }
        ]).directive("flotChartRealtime", [
            function() {
                return {
                    restrict: "A",
                    link: function(scope, ele) {
                        var data, getRandomData, plot, totalPoints, update, updateInterval;
                        return data = [], totalPoints = 300, getRandomData = function() {
                            var i, prev, res, y;
                            for (data.length > 0 && (data = data.slice(1)); data.length < totalPoints;){
                                if(data.length > 0){
                                    prev = data[data.length - 1];
                                }
                                else{
                                    prev = 50;
                                }
                                y = prev + 10 * Math.random() - 5;
                                if(0 > y){
                                    y = 0;
                                }else{
                                    if(y > 100){
                                        y = 100;
                                    }
                                }
                                data.push(y);
                            }
                            for (res = [], i = 0; i < data.length;){
                                res.push([i, data[i]]);
                                ++i;
                            }
                            return res;
                        }, update = function() {
                            plot.setData([getRandomData()]);
                            plot.draw();
                            setTimeout(update, updateInterval);
                        }, data = [], totalPoints = 300, updateInterval = 200, plot = $.plot(ele[0], [getRandomData()], {
                            series: {
                                lines: {
                                    show: !0,
                                    fill: !0
                                },
                                shadowSize: 0
                            },
                            yaxis: {
                                min: 0,
                                max: 100
                            },
                            xaxis: {
                                show: !1
                            },
                            grid: {
                                hoverable: !0,
                                borderWidth: 1,
                                borderColor: "#eeeeee"
                            },
                            colors: ["#2693E9"]
                        }), update();
                    }
                };
            }
        ]).directive("sparkline", [
            function() {
                return {
                    scope: {
                        sparkData: "=",
                        sparkOptions: "="
                    },
                    link: function(scope, ele) {
                        var data, options, sparkResize, sparklineDraw;

                        data = scope.sparkData;
                        options = scope.sparkOptions;
                        sparkResize = void 0;
                        sparklineDraw = function() {

                            ele.sparkline(data, options);

                        };
                        $(window).resize(function() {
                            return clearTimeout(sparkResize), sparkResize = setTimeout(sparklineDraw, 200);
                        });
                        sparklineDraw();
                    }
                };
            }
        ]).directive("morrisChart", [
            function() {
                return {
                    scope: {
                        data: "="
                    },
                    link: function(scope, ele, attrs) {
                        var colors, data, func, options,chart;
                        switch (data = scope.data, attrs.type) {
                            case "line":
                                return colors = void 0 === attrs.lineColors || "" === attrs.lineColors ? null : JSON.parse(attrs.lineColors), options = {
                                    element: ele[0],
                                    data: data,
                                    xkey: attrs.xkey,
                                    ykeys: JSON.parse(attrs.ykeys),
                                    labels: JSON.parse(attrs.labels),
                                    lineWidth: attrs.lineWidth || 2,
                                    lineColors: colors || ["#0b62a4", "#7a92a3", "#4da74d", "#afd8f8", "#edc240", "#cb4b4b", "#9440ed"]
                                },chart = new Morris.Line(options),$(window).resize(function(){
                                    chart.redraw();
                                });
                            case "area":
                                return colors = void 0 === attrs.lineColors || "" === attrs.lineColors ? null : JSON.parse(attrs.lineColors), options = {
                                    element: ele[0],
                                    data: data,
                                    xkey: attrs.xkey,
                                    ykeys: JSON.parse(attrs.ykeys),
                                    labels: JSON.parse(attrs.labels),
                                    lineWidth: attrs.lineWidth || 2,
                                    lineColors: colors || ["#0b62a4", "#7a92a3", "#4da74d", "#afd8f8", "#edc240", "#cb4b4b", "#9440ed"],
                                    behaveLikeLine: attrs.behaveLikeLine || !1,
                                    fillOpacity: attrs.fillOpacity || "auto",
                                    pointSize: attrs.pointSize || 4
                                }, chart = new Morris.Area(options),$(window).resize(function(){
                                    chart.redraw();
                                });
                            case "bar":
                                return colors = void 0 === attrs.barColors || "" === attrs.barColors ? null : JSON.parse(attrs.barColors), options = {
                                    element: ele[0],
                                    data: data,
                                    xkey: attrs.xkey,
                                    ykeys: JSON.parse(attrs.ykeys),
                                    labels: JSON.parse(attrs.labels),
                                    barColors: colors || ["#0b62a4", "#7a92a3", "#4da74d", "#afd8f8", "#edc240", "#cb4b4b", "#9440ed"],
                                    stacked: attrs.stacked || null
                                }, chart = new Morris.Bar(options),$(window).resize(function(){
                                    //chart.redraw();
                                });
                            case "donut":
                                /*jslint evil: true */
                                return colors = void 0 === attrs.colors || "" === attrs.colors ? null : JSON.parse(attrs.colors), options = {
                                    element: ele[0],
                                    data: data,
                                    colors: colors || ["#0B62A4", "#3980B5", "#679DC6", "#95BBD7", "#B0CCE1", "#095791", "#095085", "#083E67", "#052C48", "#042135"]
                                }, attrs.formatter && (func = new Function("y", "data", attrs.formatter), options.formatter = func), chart = new Morris.Donut(options),$(window).resize(function(){
                                    chart.redraw();
                                });
                        }
                    }
                };
            }
        ]);



    /**************************
     App ui controllers
     **************************/

    angular.module("app.ui.ctrls", []).controller("NotifyCtrl", ["$scope", "loggit",
            function($scope, loggit) {
                $scope.notify = function(type) {
                    switch (type) {
                        case "info":
                            return loggit.log("Hello! This is an alert of the info importance level.");
                        case "success":
                            return loggit.logSuccess("Great! You did something successfully.");
                        case "warning":
                            return loggit.logWarning("Warning! Something that happened that is not critical but important.");
                        case "error":
                            return loggit.logError("Error! Something went terribly wrong and needs your attention.");
                    }
                };
            }
        ]).controller("AlertDemoCtrl", ["$scope",
            function($scope) {
                $scope.alerts = [{
                    type: "success",
                    msg: "Great! You did something successfully."
                }, {
                    type: "info",
                    msg: "Hello! This is an alert of the info importance level."
                }, {
                    type: "warning",
                    msg: "Warning! Something that happened that is not critical but important."
                }, {
                    type: "danger",
                    msg: "Error! Something went terribly wrong and needs your attention."
                }];

                $scope.addAlert = function() {
                    $scope.alerts.push({msg: 'Another alert!'});
                };

                $scope.closeAlert = function(index) {
                    $scope.alerts.splice(index, 1);
                };
            }
        ]).controller("ProgressDemoCtrl", ["$scope",
            function($scope) {
                $scope.max = 200;

                $scope.random = function() {
                    var value = Math.floor((Math.random() * 100) + 1);
                    var type;

                    if (value < 25) {
                        type = 'success';
                    } else if (value < 50) {
                        type = 'info';
                    } else if (value < 75) {
                        type = 'warning';
                    } else {
                        type = 'danger';
                    }

                    $scope.showWarning = (type === 'danger' || type === 'warning');

                    $scope.dynamic = value;
                    $scope.type = type;
                };
                $scope.random();

                $scope.randomStacked = function() {
                    $scope.stacked = [];
                    var types = ['success', 'info', 'warning', 'danger'];

                    for (var i = 0, n = Math.floor((Math.random() * 4) + 1); i < n; i++) {
                        var index = Math.floor((Math.random() * 4));
                        $scope.stacked.push({
                            value: Math.floor((Math.random() * 30) + 1),
                            type: types[index]
                        });
                    }
                };
                $scope.randomStacked();
            }
        ]).controller("AccordionDemoCtrl", ["$scope",
            function($scope) {
                return $scope.oneAtATime = !0, $scope.groups = [{
                    title: "First Group Header",
                    content: "First Group Body"
                }, {
                    title: "Second Group Header",
                    content: "Second Group Body"
                }, {
                    title: "Third Group Header",
                    content: "Third Group Body"
                }], $scope.items = ["Item 1", "Item 2", "Item 3"], $scope.status = {
                    isFirstOpen: !0,
                    isFirstOpen1: !0,
                    isFirstOpen2: !0,
                    isFirstOpen3: !0,
                    isFirstOpen4: !0,
                    isFirstOpen5: !0,
                    isFirstOpen6: !0
                }, $scope.addItem = function() {
                    var newItemNo;
                    newItemNo = $scope.items.length + 1;
                    $scope.items.push("Item " + newItemNo);
                };
            }
        ]).controller("CollapseDemoCtrl", ["$scope",
            function($scope) {
                $scope.isCollapsed = !1;
            }
        ]).controller("ModalDemoCtrl", ["$scope", "$modal", "$log",
            function($scope, $modal, $log) {
                $scope.items = ['item1', 'item2', 'item3'];

                $scope.open = function (size) {

                    var modalInstance = $modal.open({
                        templateUrl: 'myModalContent.html',
                        controller: 'ModalInstanceCtrl',
                        size: size,
                        resolve: {
                            items: function () {
                                return $scope.items;
                            }
                        }
                    });

                    modalInstance.result.then(function (selectedItem) {
                        $scope.selected = selectedItem;
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                };
            }
        ]).controller("ModalInstanceCtrl", ["$scope", "$modalInstance", "items",
            function($scope, $modalInstance, items) {
                $scope.items = items;
                $scope.selected = {
                    item: $scope.items[0]
                };

                $scope.ok = function () {
                    $modalInstance.close($scope.selected.item);
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }
        ]).controller("PaginationDemoCtrl", ["$scope",
            function($scope) {
                $scope.totalItems = 64;
                $scope.currentPage = 4;

                $scope.setPage = function (pageNo) {
                    $scope.currentPage = pageNo;
                };

                $scope.pageChanged = function() {
                    console.log('Page changed to: ' + $scope.currentPage);
                };

                $scope.maxSize = 5;
                $scope.bigTotalItems = 175;
                $scope.bigCurrentPage = 1;
            }
        ]).controller("MapDemoCtrl", ["$scope", "$http", "$interval",
            function($scope, $http, $interval) {
                var i, markers;
                for (markers = [], i = 0; 8 > i;){
                    markers[i] = new google.maps.Marker({
                        title: "Marker: " + i
                    });
                    i++;
                }
                $scope.GenerateMapMarkers = function() {
                    var d, lat, lng, loc, numMarkers;
                    for (d = new Date(), $scope.date = d.toLocaleString(), numMarkers = Math.floor(4 * Math.random()) + 4, i = 0; numMarkers > i;){
                        lat = 43.66 + Math.random() / 100;
                        lng = -79.4103 + Math.random() / 100;
                        loc = new google.maps.LatLng(lat, lng);
                        markers[i].setPosition(loc);
                        markers[i].setMap($scope.map);
                        i++;
                    }
                }; $interval($scope.GenerateMapMarkers, 2e3);
            }
        ]).controller("TreeDemoCtrl", ["$scope",
            function($scope) {
                // Parameters

                $scope.list = [{
                    "id": 1,
                    "title": "1. dragon-breath",
                    "items": []
                }, {
                    "id": 2,
                    "title": "2. moiré-vision",
                    "items": [{
                        "id": 21,
                        "title": "2.1. tofu-animation",
                        "items": [{
                            "id": 211,
                            "title": "2.1.1. spooky-giraffe",
                            "items": []
                        }, {
                            "id": 212,
                            "title": "2.1.2. bubble-burst",
                            "items": []
                        }],
                    }, {
                        "id": 22,
                        "title": "2.2. barehand-atomsplitting",
                        "items": []
                    }],
                }, {
                    "id": 3,
                    "title": "3. unicorn-zapper",
                    "items": []
                }, {
                    "id": 4,
                    "title": "4. romantic-transclusion",
                    "items": []
                }];

                $scope.callbacks = {
                };

                $scope.remove = function(scope) {
                    scope.remove();
                };

                $scope.toggle = function(scope) {
                    scope.toggle();
                };

                $scope.newSubItem = function(scope) {
                    var nodeData = scope.$modelValue;
                    nodeData.items.push({
                        id: nodeData.id * 10 + nodeData.items.length,
                        title: nodeData.title + '.' + (nodeData.items.length + 1),
                        items: []
                    });
                };
            }
        ]);



    /**************************
     App custom Directives
     **************************/

    angular.module("app.directives", []).directive("imgHolder", [
            function() {
                return {
                    link: function(scope, ele) {
                        return Holder.run({
                            images: ele[0]
                        });
                    }
                };
            }
        ]).directive("customBackground", function() {
            return {
                controller: ["$scope", "$element", "$location",
                    function($scope, $element, $location) {
                        var addBg, path;
                        return path = function() {
                            return $location.path();
                        }, addBg = function(path) {
                            switch ($element.removeClass("body-home body-special body-tasks body-lock"), path) {
                                case "/":
                                    return $element.addClass("body-home");
                                case "/404":
                                case "/pages/500":
                                case "/pages/signin":
                                case "/pages/signup":
                                case "/pages/forgot":
                                    return $element.addClass("body-special");
                                case "/pages/lock-screen":
                                    return $element.addClass("body-special body-lock");
                                case "/tasks":
                                    return $element.addClass("body-tasks");
                            }
                        }, addBg($location.path()), $scope.$watch(path, function(newVal, oldVal) {
                            return newVal !== oldVal ? addBg($location.path()) : void 0;
                        });
                    }
                ]
            };
        }).directive("uiColorSwitch", [
            function() {
                return {
                    restrict: "A",
                    link: function(scope, ele) {
                        return ele.find(".color-option").on("click", function(event) {
                            var $this, hrefUrl, style;
                            if ($this = $(this), hrefUrl = void 0, style = $this.data("style"), "loulou" === style){
                                hrefUrl = "styles/main.css";
                                $('link[href^="styles/main"]').attr("href", hrefUrl);
                            }
                            else {
                                if (!style) return !1;
                                style = "-" + style;
                                hrefUrl = "styles/main" + style + ".css";
                                $('link[href^="styles/main"]').attr("href", hrefUrl);
                            }
                            return event.preventDefault();
                        });
                    }
                };
            }
        ]).directive("toggleMinNav", ["$rootScope",
            function($rootScope) {
                return {
                    link: function(scope, ele) {
                        var $content, $nav, $window, Timer, app, updateClass;
                        return app = $("#app"), $window = $(window), $nav = $("#nav-container"), $content = $("#content"), ele.on("click", function(e) {

                            if(app.hasClass("nav-min")){
                                app.removeClass("nav-min");
                            }
                            else{
                                app.addClass("nav-min");
                                $rootScope.$broadcast("minNav:enabled");
                                e.preventDefault();
                            }

                        }), Timer = void 0, updateClass = function() {
                            var width;
                            return width = $window.width(), 768 > width ? app.removeClass("nav-min") : void 0;
                        }, $window.resize(function() {
                            var t;
                            return clearTimeout(t), t = setTimeout(updateClass, 300);
                        });
                    }
                };
            }
        ]).directive("collapseNav", [
            function() {
                return {
                    link: function(scope, ele) {
                        var $a, $aRest, $lists, $listsRest, app;
                        return $lists = ele.find("ul").parent("li"),
                            $lists.append('<i class="fa fa-arrow-circle-o-right icon-has-ul"></i>'),
                            $a = $lists.children("a"),
                            $listsRest = ele.children("li").not($lists),
                            $aRest = $listsRest.children("a"),
                            app = $("#app"),
                            $a.on("click", function(event) {
                                var $parent, $this;
                                return app.hasClass("nav-min") ? !1 : ($this = $(this),
                                    $parent = $this.parent("li"),
                                    $lists.not($parent).removeClass("open").find("ul").slideUp(),
                                    $parent.toggleClass("open").find("ul").stop().slideToggle(), event.preventDefault());
                            }), $aRest.on("click", function() {
                            return $lists.removeClass("open").find("ul").slideUp();
                        }), scope.$on("minNav:enabled", function() {
                            return $lists.removeClass("open").find("ul").slideUp();
                        });
                    }
                };
            }
        ]).directive("highlightActive", [
            function() {
                return {
                    controller: ["$scope", "$element", "$attrs", "$location",
                        function($scope, $element, $attrs, $location) {
                            var highlightActive, links, path;
                            return links = $element.find("a"), path = function() {
                                return $location.path();
                            }, highlightActive = function(links, path) {
                                return path = "#" + path, angular.forEach(links, function(link) {
                                    var $li, $link, href;
                                    return $link = angular.element(link), $li = $link.parent("li"), href = $link.attr("href"), $li.hasClass("active") && $li.removeClass("active"), 0 === path.indexOf(href) ? $li.addClass("active") : void 0;
                                });
                            }, highlightActive(links, $location.path()), $scope.$watch(path, function(newVal, oldVal) {
                                return newVal !== oldVal ? highlightActive(links, $location.path()) : void 0;
                            });
                        }
                    ]
                };
            }
        ]).directive("toggleOffCanvas", [
            function() {
                return {
                    link: function(scope, ele) {
                        return ele.on("click", function() {
                            return $("#app").toggleClass("on-canvas");
                        });
                    }
                };
            }
        ]).directive("slimScroll", [
            function() {
                return {
                    link: function(scope, ele, attrs) {
                        return ele.slimScroll({
                            height: attrs.scrollHeight || "100%"
                        });
                    }
                };
            }
        ]).directive("goBack", [
            function() {
                return {
                    restrict: "A",
                    controller: ["$scope", "$element", "$window",
                        function($scope, $element, $window) {
                            return $element.on("click", function() {
                                return $window.history.back();
                            });
                        }
                    ]
                };
            }
        ]);



    /**************************
     App Form Ui Directives
     **************************/

    angular.module("app.ui.form.directives", []).directive("uiRangeSlider", [
            function() {
                return {
                    restrict: "A",
                    link: function(scope, ele) {
                        return ele.slider();
                    }
                };
            }
        ]).directive("uiFileUpload", [
            function() {
                return {
                    restrict: "A",
                    link: function(scope, ele) {
                        return ele.bootstrapFileInput();
                    }
                };
            }
        ]).directive("uiSpinner", [
            function() {
                return {
                    restrict: "A",
                    compile: function(ele) {
                        return ele.addClass("ui-spinner"), {
                            post: function() {
                                return ele.spinner();
                            }
                        };
                    }
                };
            }
        ]).directive("uiWizardForm", [
            function() {
                return {
                    link: function(scope, ele) {
                        return ele.steps();
                    }
                };
            }
        ]);

    /**************************
     App Map
     **************************/

    angular.module("app.map", []).directive("uiJqvmap", [
            function() {
                return {
                    restrict: "A",
                    scope: {
                        options: "="
                    },
                    link: function(scope, ele) {
                        var options;
                        return options = scope.options, ele.vectorMap(options);
                    }
                };
            }
        ]).controller("jqvmapCtrl", ["$scope",
            function($scope) {
                var sample_data;
                return sample_data = {
                    af: "16.63",
                    al: "11.58",
                    dz: "158.97",
                    ao: "85.81",
                    ag: "1.1",
                    ar: "351.02",
                    am: "8.83",
                    au: "1219.72",
                    at: "366.26",
                    az: "52.17",
                    bs: "7.54",
                    bh: "21.73",
                    bd: "105.4",
                    bb: "3.96",
                    by: "52.89",
                    be: "461.33",
                    bz: "1.43",
                    bj: "6.49",
                    bt: "1.4",
                    bo: "19.18",
                    ba: "16.2",
                    bw: "12.5",
                    br: "2023.53",
                    bn: "11.96",
                    bg: "44.84",
                    bf: "8.67",
                    bi: "1.47",
                    kh: "11.36",
                    cm: "21.88",
                    ca: "1563.66",
                    cv: "1.57",
                    cf: "2.11",
                    td: "7.59",
                    cl: "199.18",
                    cn: "5745.13",
                    co: "283.11",
                    km: "0.56",
                    cd: "12.6",
                    cg: "11.88",
                    cr: "35.02",
                    ci: "22.38",
                    hr: "59.92",
                    cy: "22.75",
                    cz: "195.23",
                    dk: "304.56",
                    dj: "1.14",
                    dm: "0.38",
                    "do": "50.87",
                    ec: "61.49",
                    eg: "216.83",
                    sv: "21.8",
                    gq: "14.55",
                    er: "2.25",
                    ee: "19.22",
                    et: "30.94",
                    fj: "3.15",
                    fi: "231.98",
                    fr: "2555.44",
                    ga: "12.56",
                    gm: "1.04",
                    ge: "11.23",
                    de: "3305.9",
                    gh: "18.06",
                    gr: "305.01",
                    gd: "0.65",
                    gt: "40.77",
                    gn: "4.34",
                    gw: "0.83",
                    gy: "2.2",
                    ht: "6.5",
                    hn: "15.34",
                    hk: "226.49",
                    hu: "132.28",
                    is: "12.77",
                    "in": "1430.02",
                    id: "695.06",
                    ir: "337.9",
                    iq: "84.14",
                    ie: "204.14",
                    il: "201.25",
                    it: "2036.69",
                    jm: "13.74",
                    jp: "5390.9",
                    jo: "27.13",
                    kz: "129.76",
                    ke: "32.42",
                    ki: "0.15",
                    kr: "986.26",
                    undefined: "5.73",
                    kw: "117.32",
                    kg: "4.44",
                    la: "6.34",
                    lv: "23.39",
                    lb: "39.15",
                    ls: "1.8",
                    lr: "0.98",
                    ly: "77.91",
                    lt: "35.73",
                    lu: "52.43",
                    mk: "9.58",
                    mg: "8.33",
                    mw: "5.04",
                    my: "218.95",
                    mv: "1.43",
                    ml: "9.08",
                    mt: "7.8",
                    mr: "3.49",
                    mu: "9.43",
                    mx: "1004.04",
                    md: "5.36",
                    mn: "5.81",
                    me: "3.88",
                    ma: "91.7",
                    mz: "10.21",
                    mm: "35.65",
                    na: "11.45",
                    np: "15.11",
                    nl: "770.31",
                    nz: "138",
                    ni: "6.38",
                    ne: "5.6",
                    ng: "206.66",
                    no: "413.51",
                    om: "53.78",
                    pk: "174.79",
                    pa: "27.2",
                    pg: "8.81",
                    py: "17.17",
                    pe: "153.55",
                    ph: "189.06",
                    pl: "438.88",
                    pt: "223.7",
                    qa: "126.52",
                    ro: "158.39",
                    ru: "1476.91",
                    rw: "5.69",
                    ws: "0.55",
                    st: "0.19",
                    sa: "434.44",
                    sn: "12.66",
                    rs: "38.92",
                    sc: "0.92",
                    sl: "1.9",
                    sg: "217.38",
                    sk: "86.26",
                    si: "46.44",
                    sb: "0.67",
                    za: "354.41",
                    es: "1374.78",
                    lk: "48.24",
                    kn: "0.56",
                    lc: "1",
                    vc: "0.58",
                    sd: "65.93",
                    sr: "3.3",
                    sz: "3.17",
                    se: "444.59",
                    ch: "522.44",
                    sy: "59.63",
                    tw: "426.98",
                    tj: "5.58",
                    tz: "22.43",
                    th: "312.61",
                    tl: "0.62",
                    tg: "3.07",
                    to: "0.3",
                    tt: "21.2",
                    tn: "43.86",
                    tr: "729.05",
                    tm: 0,
                    ug: "17.12",
                    ua: "136.56",
                    ae: "239.65",
                    gb: "2258.57",
                    us: "14624.18",
                    uy: "40.71",
                    uz: "37.72",
                    vu: "0.72",
                    ve: "285.21",
                    vn: "101.99",
                    ye: "30.02",
                    zm: "15.69",
                    zw: "5.57"
                }, $scope.worldMap = {
                    map: "world_en",
                    backgroundColor: null,
                    color: "#ffffff",
                    hoverOpacity: 0.7,
                    selectedColor: "#2693E9",
                    enableZoom: !0,
                    showTooltip: !0,
                    values: sample_data,
                    scaleColors: ["#87C2F0", "#1373BE"],
                    normalizeFunction: "polynomial"
                }, $scope.USAMap = {
                    map: "usa_en",
                    backgroundColor: null,
                    color: "#ffffff",
                    hoverColor: "#2693E9",
                    selectedColor: "#2693E9",
                    enableZoom: !0,
                    showTooltip: !0,
                    selectedRegion: "MO"
                }, $scope.europeMap = {
                    map: "europe_en",
                    backgroundColor: null,
                    color: "#ffffff",
                    hoverOpacity: 0.7,
                    hoverColor: "#2693E9",
                    enableZoom: !0,
                    showTooltip: !0,
                    values: sample_data,
                    scaleColors: ["#87C2F0", "#1373BE"],
                    normalizeFunction: "polynomial"
                };
            }
        ]);

    /**************************
     Timer
     **************************/
    angular.module('countTo', []).controller("countTo", ["$scope",
            function($scope) {

                return $scope.countersmall1 = {
                    countTo: 20,
                    countFrom: 0
                },$scope.countersmall2 = {
                    countTo: 42,
                    countFrom: 0
                },$scope.countersmall3 = {
                    countTo: 90,
                    countFrom: 0
                },$scope.countersmall1dash = {
                    countTo: 420,
                    countFrom: 0
                },$scope.countersmall2dash = {
                    countTo: 742,
                    countFrom: 0
                },$scope.countersmall3dash = {
                    countTo: 100,
                    countFrom: 0
                };

            }]).directive('countTo', ['$timeout', function ($timeout) {
            return {
                replace: false,
                scope: true,
                link: function (scope, element, attrs) {

                    var e = element[0];
                    var num, refreshInterval, duration, steps, step, countTo, value, increment;

                    var calculate = function () {
                        refreshInterval = 30;
                        step = 0;
                        scope.timoutId = null;
                        countTo = parseInt(attrs.countTo) || 0;
                        scope.value = parseInt(attrs.value, 10) || 0;
                        duration = (parseFloat(attrs.duration) * 1000) || 0;

                        steps = Math.ceil(duration / refreshInterval);
                        increment = ((countTo - scope.value) / steps);
                        num = scope.value;
                    };

                    var tick = function () {
                        scope.timoutId = $timeout(function () {
                            num += increment;
                            step++;
                            if (step >= steps) {
                                $timeout.cancel(scope.timoutId);
                                num = countTo;
                                e.textContent = countTo;
                            } else {
                                e.textContent = Math.round(num);
                                tick();
                            }
                        }, refreshInterval);

                    };

                    var start = function () {
                        if (scope.timoutId) {
                            $timeout.cancel(scope.timoutId);
                        }
                        calculate();
                        tick();
                    };

                    attrs.$observe('countTo', function (val) {
                        if (val) {
                            start();
                        }
                    });

                    attrs.$observe('value', function (val) {
                        start();
                    });

                    return true;
                }
            };

        }]);



});
