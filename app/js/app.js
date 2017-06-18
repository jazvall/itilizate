'use strict';

var app = angular.module("app", ["ngRoute","ui.bootstrap"])
.directive('angularStarRating', angularStarRating)
.directive('showFocus', angularShowFocus);

app.config(function ($routeProvider) {
    $routeProvider.
     when('/', {
        templateUrl: 'views/welcome.html',
        controller: 'WelcomeController'
    }).
    when('/welcome', {
        templateUrl: 'views/welcome.html',
        controller: 'WelcomeController'
    }).
    when('/process', {
        templateUrl: 'views/process.html',
        controller: 'ProcessController'
    }).
    when('/tasks-resume', {
        templateUrl: 'views/tasksresume.html',
        controller: 'TasksResumeController'
    }).
    when('/user-guide', {
        templateUrl: 'views/userguide.html',
        controller: 'userGuideController'
    }).
    when('/itil-guide', {
        templateUrl: 'views/itilguide.html'
    }).
    when('/info', {
        templateUrl: 'views/info.html'
    }).
    otherwise({
        redirectTo: '/welcome'
    });
     
});


function angularStarRating() {
    var directive = {

        restrict: 'EA',
        scope: {
            'value': '=value',
            'max': '=max',
            'hover': '=hover',
            'color': '=color',
            'style': '=style',
            'isReadonly': '=isReadonly'
        },
        link: linkFunc,
        template:
            '<span ng-class="{{color}}">' +
            '<i ng-class="renderObj"' +
            'ng-repeat="renderObj in renderAry"' +
            'ng-click="setValue($index)" ' +
            'ng-mouseenter="changeValue($index, changeOnHover)"' + 
            ' popover="Nivel {{$index+1}}" popover-trigger="mouseenter" popover-placement="top" popover-append-to-body="true" >' +
            '</i>' +
            '</span>',
        replace: true
    };
    return directive;
}

function linkFunc(scope, element, attrs, ctrl) {
    if (scope.max === undefined) scope.max = 5; // default

    function renderValue() {
        scope.renderAry = [];
        for (var i = 0; i < scope.max; i++) {
            if (i < scope.value) {            
                scope.renderAry.push({
                    'glyphicon glyphicon-star glyphicon-shadow-big': true
                });
            } else {
                scope.renderAry.push({
                    'glyphicon glyphicon-star-empty glyphicon-shadow-big': true
                });
            }
        }
    }

    scope.setValue = function (index) {
        if (!scope.isReadonly && scope.isReadonly !== undefined) {
            scope.value = index + 1;
        }
    };

    scope.changeValue = function (index) {
        if (scope.hover) {
            scope.setValue(index);
        } else {
            // !scope.changeOnhover && scope.changeOnhover != undefined
        }
    };

    scope.$watch('value', function (newValue, oldValue) {
        if (newValue) {
            renderValue();
        }
    });
    scope.$watch('max', function (newValue, oldValue) {
        if (newValue) {
            renderValue();
        }
    });

}

function angularShowFocus($timeout) {
    return function(scope, element, attrs) {
        scope.$watch(attrs.showFocus, 
          function (newValue) { 
            $timeout(function() {
                newValue && element[0].focus();
            });
        },true);
    }; 
}


