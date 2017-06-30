'use strict';

var app = angular.module("app", ["ngRoute","ui.bootstrap"]);

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



