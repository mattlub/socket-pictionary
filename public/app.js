(function () {

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
  socket.addEventListener('player selected', (player) => {
    console.log(`current player name: ${player.name}, id: ${player.id}`);
    // start game
    // render board
  })

  socket.addEventListener('word', word => {
    console.log(word);
    clientState.isArtist = true;
    // display word on screen
  });

  function startGame () {
    // don't really want to do this.
    helpers.getState(renderGame);
  }

  function renderGame (state) {
    console.log(state);
    Render.renderChat(appContainer, socket, state);
    // render canvas on socket 'game' event or similar?
    Render.renderCanvas(appContainer, socket, state, clientState);
  }

  Render.renderNameInputScreen(appContainer, socket, startGame);

})();
