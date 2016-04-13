var drag = require('drag-and-drop-files');
var fetch = require('isomorphic-fetch');

var dropTarget = document.querySelector('#dropTarget')

drag(dropTarget, function(files) {
console.log('file ttype', typeof files[0]);
  fetch('/', {
    method: 'POST',
    headers: {
      'Accept': 'text/json'
    },
    body: files[0]
  }).then(function(response) {
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    console.log('first then data!!', response);
    return response.text();
  }).then(function(text) {
    console.log('second data!!', text);
    dropTarget.innerText = text;
  }).catch(function(ex) {
    console.log('exception', ex);
  });
})
