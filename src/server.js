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

const GAME_LENGTH = 30000
const GAMEOVER_LENGTH = 3000

// current socket messages received:
// connection
// message
// draw
// disconnect

// current socket messages emitted:
// player selected
// word (to specific player)
// message
// draw
// player disconnected

// set up static files
var staticPath = path.join(__dirname, '../public');
app.use(express.static(staticPath));

// state, currently not really used
var state = {
  // id's of connected clients
  allClients: [],
  // currPlayers stores {name, id} (all clients which have entered a name)
  currPlayers: [],
  currentArtist: undefined,
  currentWord: undefined
};

var gameOverTimeout

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

    // timeout to end game if no winner
    gameOverTimeout = setTimeout(() => {
      gameOver(state, null)
      setTimeout(selectPlayerAndWord, GAMEOVER_LENGTH)
    }, GAME_LENGTH)
  }
  else {
    // TODO
  }
}

function gameOver (state, name) {
  io.sockets.emit('game over', {
    word: state.currentWord,
    winner: name
  })
}

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
    if (state.currPlayers.length === 1) {
      selectPlayerAndWord()
    }
  })

  // message
  socket.on('message', function(info) {
    // info is {id, message}
    console.log('received message from ' + id);

    // get name from currPlayers array
    var name = state.currPlayers.filter(function (player) {
      return player.id === id
    })[0].name;

    console.log(state.currentArtist);

    if (!(info.message === state.currentWord && state.currentArtist && info.id === state.currentArtist.id)) {
      // emit message with name now, unless it's the correct word and by the artist
      io.emit('message', {
        name: name,
        id: info.id,
        message: info.message,
        isCorrect: info.message === state.currentWord
      });

    }

    if (info.message === state.currentWord && state.currentArtist && info.id !== state.currentArtist.id ) {
      console.log('word guessed');
      clearTimeout(gameOverTimeout)
      gameOver(state, name)
      setTimeout(selectPlayerAndWord, GAMEOVER_LENGTH)
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
