angular.module('testApp.controllers', []);
angular.module('testApp.services', []);
angular.module('testApp.directives', []);

var app = angular.module('testApp', ['testApp.controllers','testApp.services','testApp.directives','ngAnimate','ngCookies','ngResource','ngRoute','ngSanitize','ngTouch', 'firebase', 'ui.router']);


// app.config(function ($routeProvider) {
//     $routeProvider
//       .when('/', {
//         templateUrl: 'views/main.html',
//         controller: 'MainCtrl'
//       })
//       .otherwise({
//         redirectTo: '/'
//       });
//   });


app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/main");
  $stateProvider
    .state('main', {
      url: "/main",
      templateUrl: "views/main.html",
      controller: 'MainCtrl'
    })
});