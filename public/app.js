(function () {

  var appContainer = document.getElementsByClassName('app')[0];

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
    // display word on screen
  });

  function startGame () {
    helpers.getState(renderGame);
  }

  function renderGame (state) {
    console.log(state);
    renderChat(appContainer, socket, state);
    // render canvas on socket 'game' event or similar?

  }

  function renderChat (app, socket, state) {
    chatTitle = helpers.quickCreateElement('h4', {textContent: 'Live chat:'});
    chatList = helpers.quickCreateElement('ul', {class: 'chat-list'});
    chatInput = helpers.quickCreateElement('input');
    chatInput.addEventListener('keypress', function(e) {
      if (e.keyCode === 13 && this.value.length > 0) {
        socket.emit('message', {
          id: socket.id,
          message: this.value.slice(0,40)
        });
        this.value = '';
      }
    });
    app.appendChild(chatTitle);
    app.appendChild(chatList);
    app.appendChild(chatInput);

    socket.addEventListener('message', (info) => {
      chatList.appendChild(helpers.quickCreateElement('li', {
        textContent: `${info.name}: ${info.message}`
      }));
    })
  }

  Render.renderNameInputScreen(appContainer, socket, startGame);

})();
