// ----------------------------------------------------------------------------
// GAME STATE
// ----------------------------------------------------------------------------

// ------------------------------------
// Game Objects
// ------------------------------------

// ----------------------------------------------------------------------------
// SERVER
// ----------------------------------------------------------------------------

var express = require('express'); 
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// ------------------------------------
// Socket.io
// ------------------------------------

io.on('connection', function(socket){
  socket.emit('connection');

	console.log("New player joined !");

  socket.on('say', function(msg) {
  	console.log("say", msg);
  	if(socket.other)
  		socket.other.emit('say', msg);
  });

});

// ------------------------------------
// Express
// ------------------------------------

app.use(express.static("client"));

// ------------------------------------
// HTTP
// ------------------------------------

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on port 3000');
});