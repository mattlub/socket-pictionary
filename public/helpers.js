var helpers = {

  // is this necessary?
  getState: function (callback) {
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
  },

  quickCreateElement: function (type, opts) {
    let el = document.createElement(type);
    for (let attr in opts) {
      if (attr === 'class') {
        el.classList.add(opts[attr]);
      }
      else if (attr === 'textContent') {
        el.textContent = opts[attr];
      }
      else {
        el.setAttribute(attr, opts[attr]);
      }
    }
    return el
  }

}
