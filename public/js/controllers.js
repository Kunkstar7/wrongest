'use strict';

angular.module('wrong.controllers', ['wrong.services']).

    /*
    * Lobby Management controller.
    */
  controller('joinCtrl', function ($scope, socket) {
      
    //Initial connection, happens for every connection.
    socket.on('init', function (data) {
        $scope.users = data.users;
        //Initialization routine.
    });
  
    /*
     * Lobby Join Actions - Client Side
     * Emit Events
     */
    
    //Emit an attempt to join the next available lobby.
    $scope.joinAvailableLobby = function() {
      socket.emit('join:available', { id: '%'}, function(result) {
          $scope.name = 'Bozo';
      }
      );
          
    };
    
    //Emit an attempt to join a specified lobby.
    //The given id does not have to be valid here.
    $scope.joinSpecifiedLobby = function(){
        socket.emit('join:specified', {
            id: $scope.lobbyID
        });
    };
    
    //Emit an attempt to join a new lobby.
    $scope.createNewLobby = function() {
        var newLobbyID = $scope.newLobbyID;
    };
  
  
}).



/*
    * Game Interaction controller.
    */
  controller('gameCtrl', function ($scope, socket) {
      
     /*
     * Lobby Join Actions - Client Side
     * Emit Events
     */ 
  });