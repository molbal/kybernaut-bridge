var path = require('path');
var WebSocketClient = require('websocket').client;
var express = require('express');

var app = express();

var client = new WebSocketClient();


client.on('connectFailed', function(error) {
   console.log('Connect Error: ' + error.toString()+" - exiting.");
   process.exit(1);
});

client.on('connect', function(connection) {
   console.log('WebSocket Client Connected');
   connection.on('error', function(error) {
      console.log("Connection Error: " + error.toString());
   });
   connection.on('close', function() {
      console.log('Connection Closed');
      process.exit(1);
   });
   connection.on('message', function(message) {
      console.log('Message received - type: ' + message.type);
      if (message.type === 'utf8') {
         console.log("Received: '" + message.utf8Data + "'");
         
         axios.post(process.env.HOST_URL, {
            killmail: message,
            passcode: process.env.PASSCODE
         })
         .then(res => {
            console.log(`statusCode: ${res.statusCode}`)
            console.log(res)
         })
         .catch(error => {
            console.error(error)
         })
      }
   });
   
   
   var regionIds = [10000002,12000001, 12000002,12000003,12000004,12000005];
   regionIds.forEach(regionId => {    
      console.log('Subscribing to region '+regionId)
      connection.sendUTF('{"action":"sub","channel":"region:'+12000005+'"}');
      
   });
});
   
client.connect('wss://zkillboard.com/websocket/');
module.exports = app;
