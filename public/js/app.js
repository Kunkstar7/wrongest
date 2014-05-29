'use strict';

var app = angular.module('wrong', ['ngRoute', 'wrong.controllers', 'wrong.services']).

config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/lobby',
      controller: 'lobbyCtrl'
    }).
    when('/game', {
      redirectTo: '/'
    }).
    when('/game/:gameID', {
      templateUrl: 'partials/game',
      controller: 'gameCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
});