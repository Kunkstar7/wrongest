/**
* Module dependencies
*/

var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

/**
* Configuration
*/

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'client')));
app.use(app.router);


/**
* Routes
*/

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);


// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication
io.sockets.on('connection', require('./routes/socket'));

/**
* Start Server
*/

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});