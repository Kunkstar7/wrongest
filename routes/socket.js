//Persistent list of currently created games.
var games = [];
/* Game Model
 * id: Game id.
 * players: Array of current connected sockets.
 * phase: phase of gameplay.
 * To be added: implementation of game information.
 */
 
 //Test game object.
 games.push({id: 1, players: [], phase:0});
 
 /*Socket functions exported as module.*/
module.exports = function (socket) {

    //Initial Connection.
    socket.emit('init', {
        name: "koe",
        gameList: games
      });
      
    /*
     * Lobby Join Actions - Server Side
     * Execute upon receiving an emit.
     */
     
     //Join the next available lobby. Create a new one if one isn't available.
    socket.on('join:available', function(data, fn){
        
        fn(true);
    });
    
    //Join the specified lobby.
    socket.on('join:specified', function(data, fn){
        socket.join(data.id);
    });
    
    //Create a new lobby and join it.
    socket.on('join:new', function (data, fn){
        var generatedID = Math.random().toString(36).substr(2, 7);
        socket.join(generatedID);
    });
    
    /*
     * Helper Functions
     */
     function verifyID(id){
         return (socket.manager.rooms[id] === undefined) ? false : true;
     }
     
     function generateNewID(){}
     
      
};