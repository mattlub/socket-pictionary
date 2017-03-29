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

  return {
    renderNameInputScreen: renderNameInputScreen
  }

})();
