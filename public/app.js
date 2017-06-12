var pictionary = (function () {

  var appContainer = document.getElementsByClassName('app')[0];

  var clientState = {
    isArtist: false,
    isDrawing: false,
    lastX: null,
    lastY: null
  };

  // initiate socket
  var socket = io();



  // player selected event should start new game.
  socket.addEventListener('player selected', function (player) {
    // set isArtist to false to prevent draw events being fired
    if (player.id !== socket.id) {
      clientState.isArtist = false;
    }
    // restart game
    if (document.querySelector('.message')) {
      document.querySelector('.message').innerHTML = 'The artist is ' + player.name + '! You are guessing!';
    }
    if (document.querySelector('canvas')) {
      var canvas = document.querySelector('canvas');
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  })

  socket.addEventListener('word', function (word) {
    console.log(word);
    clientState.isArtist = true;
    // display word on screen
    if (document.querySelector('.message')) {
      document.querySelector('.message').innerHTML = 'You are the artist! Draw ' + word + '!';
    }
  });

  socket.addEventListener('game over', function (data) {
    // data is of the form { word, winner: (name or null)}
    var message = 'Game over! The word was ' + data.word + ', '
    message += data.winner
      ? data.winner + ' wins!'
      : 'no one wins!'
    if (document.querySelector('.message')) {
      document.querySelector('.message').innerHTML = message
    }
  });

  // function renderGameScreen () {
  //   // render all the stuff
  //   startGame()
  // }

  function startGame () {
    // render game screen first
    //   - with chat
    //   - and status bar e.g.
    //     - hi player1! You're the artist. Word is 'ball'
    //     - hi jon! You're guessing. The word is _ _ _ _
    // - render new canvas each time game starts, or just blank the canvas
    Render.renderStatusBar(appContainer, socket);
    Render.renderChat(appContainer, socket);
    // render canvas on socket 'game' event or similar?
    Render.renderCanvas(appContainer, socket, clientState);
  }

  Render.renderNameInputScreen(appContainer, socket, startGame);

})();
