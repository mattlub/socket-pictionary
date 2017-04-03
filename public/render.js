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

  function renderStatusBar (app, socket) {
    var statusBar = helpers.quickCreateElement('div', {
      class: 'statusBar'
    });
    var messageSpan = helpers.quickCreateElement('span', {
      class: 'message',
      textContent: 'Welcome to the game!'
    });
    // var wordSpan = helpers.quickCreateElement('span', {
    //   class: 'word'
    // });
    statusBar.appendChild(messageSpan);
    // statusBar.appendChild(wordSpan);
    app.appendChild(statusBar);
  }

  function renderChat (app, socket) {
    var chatTitle = helpers.quickCreateElement('h4', {textContent: 'Live chat:'});
    var chatList = helpers.quickCreateElement('ul', {class: 'chat-list'});
    var chatInput = helpers.quickCreateElement('input');
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

  function renderCanvas (app, socket, cState) {
    var canvas = helpers.quickCreateElement('canvas', {
      width: '200px',
      height: '200px',
      style: 'border: 1px solid black'
    });
    var ctx = canvas.getContext("2d");
    // canvas.width = window.innerWidth * 0.9;
    // canvas.height = window.innerHeight * 0.7;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 10;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    function draw (e) {
      if (!cState.isDrawing || !cState.isArtist) {
        return
      }
      var info = {
        fromX: cState.lastX,
        fromY: cState.lastY,
        toX: e.offsetX,
        toY: e.offsetY
      }
      socket.emit('draw', info);
      // ctx.beginPath();
      // ctx.moveTo(cState.lastX, cState.lastY);
      // ctx.lineTo(e.offsetX, e.offsetY);
      // ctx.stroke();
      cState.lastX = e.offsetX;
      cState.lastY = e.offsetY;
    };

    function stopDrawing () {
      cState.isDrawing = false;
      canvas.classList.remove("drawing");
    };

    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mousedown", function (e) {
      cState.lastX = e.offsetX;
      cState.lastY = e.offsetY;
      cState.isDrawing = true;
      canvas.classList.add("drawing");
    });
    canvas.addEventListener("mouseup", stopDrawing);
    // change this so mousein resumes drawing
    canvas.addEventListener("mouseout", stopDrawing);

    socket.addEventListener('draw', function(info) {
      ctx.beginPath();
      ctx.moveTo(info.fromX, info.fromY);
      ctx.lineTo(info.toX, info.toY);
      ctx.stroke();
    });

    app.appendChild(canvas);
  }

  return {
    renderNameInputScreen: renderNameInputScreen,
    renderStatusBar: renderStatusBar,
    renderChat: renderChat,
    renderCanvas: renderCanvas
  }

})();
