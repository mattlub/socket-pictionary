var Render = (function () {

  function renderNameInputScreen (app, socket, callback) {
    // Name input logic
    var name;
    var nameInput = helpers.quickCreateElement('input', {
      class: 'name-input',
      type: 'text',
      placeholder: 'Your name'
    });

    var nameInputListener = function (e) {
      // if enter pressed and input not empty
      if (e.keyCode === 13 && this.value.length !== 0) {
        name = this.value;
        this.removeEventListener('keypress', nameInputListener);
        this.classList.add('hidden');
        data = {name: name, socket: socket};
        socket.emit('name', {
          name: name,
          id: socket.id,
        });
        callback();
      }
    }
    nameInput.addEventListener('keypress',  nameInputListener);
    app.appendChild(nameInput);
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

  return {
    renderNameInputScreen: renderNameInputScreen,
    renderChat: renderChat
  }

})();
