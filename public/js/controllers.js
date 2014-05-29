'use strict';

angular.module('wrong.controllers', ['wrong.services']).

    /*
    * Game Management controller.
    */
  controller('lobbyCtrl', function ($scope, socket, games) {
      
      
    //Set up the controller scope.
    $scope.games = games.load();
    
    //Random id for game creation.
    $scope.generatedId = Math.random().toString(36).substr(2, 7);
   
      
    //Initial connection, happens for fresh connection.
    socket.on('init', function (data) {
        
        //Sync with the server data.
        games.setup(data.gameList);
        $scope.games = games.load();
    });
  
   
   
   socket.on('game:added', function(data) {
       games.add(data.id,data.game);
       //Resync with server data.
       
   });
    /*
     * Lobby Join Actions - Client Side
     * Emit Events
     */
    
    //Emit an attempt to join an existing game.
    $scope.joinGame = function(given){
        socket.emit('lobby:join', {
            id: given
        }, function(result){
            if(!result){
                alert("Failed to join.");
                return false;
            } else {}
                // I don't think anything else besides redirect needs to occur client side.
            }
        );
    };
    
    //Emit an attempt to join a new lobby.
    $scope.createGame = function(id, players, rounds) {
        socket.emit('lobby:create', {
            id: id,
            totalPlayers: players,
            totalRounds: rounds
        }, function(result){
            if(!result){
                alert("Failed to create game.");
                return false;
            } else {}
                // I don't think anything else besides redirect needs to occur client side.
            }
        );
    };
  
  
}).



/*
    * Game Interaction controller.
    */
  controller('gameCtrl', function ($scope, socket, games, $routeParams) {
    
    //Set up the controller scope.
    $scope.game = games.get($routeParams.gameID);
    
    
    //If we already have been connected then the game list will have been filled.
    //Otherwise we will have to wait for the init event to set up everything.
    if($scope.game != undefined){
        $scope.rid = "here";
    }
    
    
     /*
     * Game Actions - Client Side
     * Emit Events
     
     *Initial connection, happens for only fresh connections.*/
    socket.on('init', function (data) {
        //Sync with the server data.
        games.setup(data.gameList);

        $scope.game = games.get($routeParams.gameID);
        //Initialization routine.
    });
    
    //Emit an attempt to select the most wrong card.
    $scope.selectMost = function(player, card){
        socket.emit('choice:most', {
            playerId: player,
            selected: card
        });
    };
    
     
     
  });