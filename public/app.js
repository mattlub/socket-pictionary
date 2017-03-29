(function () {

  var appContainer = document.getElementsByClassName('app')[0];

  // initiate socket
  var socket = io();

  // player selected event should start new game.
  socket.addEventListener('player selected', (player) => {
    var playerSpan = document.createElement('span');
    playerSpan.textContent = `current player name: ${player.name}, id: ${player.id}`;
    appContainer.appendChild(playerSpan)
  })

  // is this necessary?
  function getState (callback) {
    // send request
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      }
      // TODO: other status code cases
    }
    xhr.open('GET', '/state');
    xhr.send();
  }

  function startGame () {
    getState(renderGame)
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
