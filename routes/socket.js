//Persistent list of currently created games, this is the server's authoritative model.
var games = {};
/* Game Model
 * info - Crucial information about the game.
 * ---- id: key for game within list.
 * ---- currentPlayers: Current number of entered players.
 * ---- maxPlayers: Number of players needed.
 * ---- totalRounds: Rounds to be played.
 *
 * players - Players within the game.
 * ---- id: Player's id.
 * ---- playing: Whether they are currently participating or not.
 * ---- score: The score the player has achieved.
 * ---- card: The card dealt to the player.
 * ---- mostChoice: The card choice of most wrong. (smallint based on player number)
 *
 * state - The current state of the given game.
 * ---- currentRound: The round the game is on.
 * ---- playersFinished: The number of players who have finished their choices.
 *
 *-------- May or may not be needed?
 * cards: Deck of cards to play from.
 * ---- quote: The quote of the card.
 * ---- value: Point value for the card.
 */
 
 var cards = require("../cards");
 
 /*Socket functions exported as module.*/
module.exports = function (socket) {

    //On initial connection, broadcast server's view to all connections.
    socket.emit('init', {
        gameList: games
      });
      
    /*
     * Lobby Join Actions - Server Side
     * Execute upon receiving an emit.
     */
    
    //Join the specified game.
    socket.on('lobby:join', function(data, fn){
        socket.join(data.id);
        games[data.id].currentPlayers = games[data.id].currentPlayers + 1;
        var newPlayer = {socket: socket, name: "", score: 0};
        games[data.id].players.push(newPlayer);
        //Check for need to begin game.
    });
    
    //Create a new game and join it.
    socket.on('lobby:create', function (data, fn){
        
        //Make sure the key doesn't already exist.
        if(!(data.id in games)){
            //Add the game to the authoritative model.
            createGame(data.id, data.totalPlayers, data.totalRounds);
            
            //Have the socket join the broadcast room to receive events.
            socket.join(data.id);
            
            //Now that game is created, also add the player into the game.
            //Note: This is a temporary ID assignment until sessions arrive.
            var randName = Math.random().toString(36).substr(2, 7);
            games[data.id].players[randName]= {id:randName, playing:false,score:0};
            games[data.id].info.currentPlayers += 1;
            
            //Broadcast this model change to everyone.
            socket.emit('game:added', {id: data.id, game:games[data.id]});
        }
    });
    
    /*
     * Helper Functions
     */
     
     //Add a new game entry to the server's list of games.
     function createGame(id, totalPlayers, totalRounds){
         var newGame = {info: {}, players: {}, state:{}};
         
         //Set up the info section.
         newGame.info.id = id;
         newGame.info.currentPlayers = 0; //Always start with no players.
         newGame.info.totalPlayers = totalPlayers;
         
         //Set up state section
         newGame.state.currentRound = 0;
         newGame.playersFinished = 0;
         
         //Set up game's deck. Fill the deck with exactly enough cards for each player
         //to get one card for each round to be played.
         var size = totalPlayers * totalRounds;
         newGame.deck = buildDeck(size);
         
         //Add the game to the server's model.
         games[newGame.info.id] = newGame;
     }
     
     //Build the deck of cards to the given size.
     //This function needs to be enhanced to include all the features of cards.
    function buildDeck(size){
        
        var quotesUsed = [];
        var deck = [];
        console.log("here");
        //Build cards for each slot needed.
        for(var i=0;i<size;i++){
           
            var randIndex = Math.floor((Math.random() * cards.length) + 1); //Pick random quote.

             //Iterate through making sure we have unique quotes.
             //NOTE - We've used indexOf() which is not supported in IE7/8. Find a suitable replacement later.
            while(quotesUsed.indexOf(randIndex) >= 0){
                randIndex = Math.floor((Math.random() * cards.length) + 1);
            }
            
            //Add the card to the game's deck, tell the generator that we've used this quote now.
            console.log(cards[randIndex]);
            deck.push({quote:cards[randIndex], value:1});
            quotesUsed.push(randIndex);
            
        }
        
        return deck;
    }
     
      
};