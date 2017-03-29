var http = require('http')

var express = require('express');
var socket = require('socket.io');

var PORT = process.env.PORT || 3000;

var app = express();
var server = http.Server(app);
var io = socket(server);

// set up static files
app.use(express.static(__dirname + '/public'));

// basic route handler
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/state', function(req, res) {
    res.send(JSON.stringify(state));
});

// state
var state = {
  allClients: [],
  currPlayers: [],
  currentArtist: null,
  currentWord: null,
  isGuessing: false,
}

// store id's of connected clients
var allClients = [];
var currPlayers = [];

// add logic for socket connection
io.sockets.on('connection', function(socket) {
  var id = socket.client.id;
  console.log('connection!: id=' + id);
  // could push whole socket instead, need to look into whether it's suitable
  // to use client id here
  allClients.push(id);

  socket.on('message', function(info) {
    // info is id, message
    console.log('received message from ' + id);
    // get name from currPlayers array
    var name = currPlayers.filter(function (player) {
      return player.id === id
    })[0].name;
    // emit message with name now.
    io.emit('message', {
      name: name,
      id: info.id,
      message: info.message
    });
  })

  socket.on('name', function(info) {
    // info is name and id
    currPlayers.push(info);
    console.log(currPlayers);
  })

  // handle disconnect
  socket.on('disconnect', function() {
    console.log('disconnection! id=' + id);
    // remove from all clients array
    var i = allClients.indexOf(id);
    allClients.splice(i, 1);

    // remove from currPlayers array
    i = currPlayers.map(player => player.id).indexOf(id);
    currPlayers.splice(i, 1);

    // send player disconnected event
    io.emit('player disconnected', {id: id});
  });

  // to remember syntax
  io.emit('nothing', {});

});

server.listen(PORT, function () {
  console.log('listening on port ' + PORT);
});
