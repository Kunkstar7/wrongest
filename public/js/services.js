'use strict';

angular.module('wrong.services', []).

factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
}).


factory('games', function ($rootScope) {
    var list = {};
    var service = {};
        
    /* Game Model
     * id: Game id.
     * players: Array of current connected sockets.
     * phase: phase of gameplay.
     * To be added: implementation of game information.
     */
     service.setup = function(gameList){
         list = gameList;
     }
     
    service.add = function(id, game){
        list[id] = game;
    };
    
    service.load = function(){
        return list;
    }
    service.get = function(id){
        return list[id];
    }
        
     return service;
});