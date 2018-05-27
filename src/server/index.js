const jsdom = require('jsdom')
const { JSDOM } = jsdom;
const Datauri = require('datauri');
const datauri = new Datauri();

(async function(){
  global.dom = await JSDOM.fromFile('index.html', {
    // To run the scripts in the html file
    runScripts: "dangerously",
    // Also load supported external resources
    resources: "usable",
    // So requestAnimatinFrame events fire
    pretendToBeVisual: true
  })

  dom.window.URL.createObjectURL = function (blob) {
    if(blob){
      return datauri.format(blob.type, blob[Object.getOwnPropertySymbols(blob)[0]]._buffer).content;
    }
  };

  dom.window.URL.revokeObjectURL = function (objectURL) {
    // Do nothing at the moment
  };

  dom.window.io = require('socket.io')(2000);
  dom.window.Player = require('./shared/player');
  dom.window.NetworkManager = require('./shared/network-manager');
  dom.window.NetworkController = require('./shared/network-controller');
  dom.window.phaser;
})()
