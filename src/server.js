var http = require('http');
var path = require('path');
var express = require('express');
var socket = require('socket.io');

var { selectRandom } = require('./helpers');
var words = require('./words.js');

var PORT = process.env.PORT || 3000;

var app = express();
var server = http.Server(app);
var io = socket(server);

// set up static files
var staticPath = path.join(__dirname, '../public');
app.use(express.static(staticPath));

// basic route handler
app.get('/', function(req, res) {
  var indexPath = path.join(__dirname, '../public/index.html');
  res.sendFile(indexPath);
});

app.get('/state', function(req, res) {
  res.send(JSON.stringify(state));
});

// state, currently not really used
var state = {
  // id's of connected clients
  allClients: [],
  // currPlayers stores {name, id} (all clients which have entered a name)
  currPlayers: [],
  currentArtist: undefined,
  currentWord: undefined
};

// TODO refactor so this doesn't access stuff outside its scope
function selectPlayerAndWord () {
  var selectedPlayer = selectRandom(state.currPlayers);

  if (selectedPlayer) {
    console.log('new player selected: ', selectedPlayer);
    // send player selected event to all sockets
    io.sockets.emit('player selected', selectedPlayer);

    var randomWord = selectRandom(words);
    // emit to specific socket
    io.to(selectedPlayer.id).emit('word', randomWord);

    state.currentArtist = selectedPlayer;
    state.currentWord = randomWord;
  }
}

// interval to select player
var interval = setInterval(selectPlayerAndWord , 10000)

// add logic for socket connection
io.sockets.on('connection', function(socket) {
  // socket.client.id or just socket.id
  var id = socket.id;
  console.log('new connection: id=' + id);
  state.allClients.push(id);

  // successful name entry
  socket.on('name', function(info) {
    // info is name and id
    state.currPlayers.push(info);
    console.log(state.currPlayers);
  })

  // message
  socket.on('message', function(info) {
    // info is {id, message}
    console.log('received message from ' + id);

    // get name from currPlayers array
    var name = state.currPlayers.filter(function (player) {
      return player.id === id
    })[0].name;

    // emit message with name now.
    io.emit('message', {
      name: name,
      id: info.id,
      message: info.message,
      isCorrect: info.message === state.currentWord
    });

    if (info.message === state.currentWord) {
      console.log('word guessed');
      if (interval) {
        clearInterval(interval);
        selectPlayerAndWord();
        interval = setInterval(selectPlayerAndWord , 10000)
      }
      io.emit('game over', {})
    }
  })

  // info is {fromX, fromY, toX, toY}
  socket.on('draw', function(info) {
    // only emit if it comes from current artist
    if (state.currentArtist.id && id === state.currentArtist.id) {
      io.emit('draw', info);
    }
  });

  // handle disconnect
  socket.on('disconnect', function() {
    console.log('disconnection! id=' + id);
    // remove from all clients array
    var i = state.allClients.indexOf(id);
    state.allClients.splice(i, 1);

    // remove from currPlayers array
    i = state.currPlayers.map(player => player.id).indexOf(id);
    state.currPlayers.splice(i, 1);

    // send player disconnected event
    io.emit('player disconnected', {id: id});
  });

});

server.listen(PORT, function () {
  console.log('listening on port ' + PORT);
});
