angular.module('testApp.controllers', []);
angular.module('testApp.services', []);
angular.module('testApp.directives', []);

var app = angular.module('testApp', ['testApp.controllers','testApp.services','testApp.directives','ngAnimate','ngCookies','ngResource','ngRoute','ngSanitize','ngTouch', 'firebase', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/main/0");
  $stateProvider
    .state('main', {
      url: "/main/{id:int}",
      templateUrl: "views/main.html",
      controller: 'MainCtrl'
    })
});