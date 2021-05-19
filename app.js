var path = require('path');
var WebSocketClient = require('websocket').client;
var express = require('express');
var axios = require('axios').default;

var app = express();

var client = new WebSocketClient();

if (!process.env.HOST_URL) {
   console.error("HOST_URL environment variable is unset.");
   process.exit(2);
}

if (!process.env.PASSCODE) {
   console.error("PASSCODE environment variable is unset.");
   process.exit(2);
}

if (!process.env.REGION_IDS) {
   console.error("REGION_IDS environment variable is unset.");
   process.exit(2);
}


client.on('connectFailed', function(error) {
   console.log('Connect Error: ' + error.toString()+" - exiting.");
   process.exit(1);
});

client.on('connect', function(connection) {
   console.log('WebSocket Client Connected');
   connection.on('error', function(error) {
      console.log("Connection Error: " + error.toString());
      process.exit(1);
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
            console.log(`Sent littlekill to Abyss Tracker - statusCode: ${res.statusCode}`)
            console.log(res)
         })
         .catch(error => {
            console.error(error)
         })
      }
   });
   
   
   var regionIds = process.env.REGION_IDS.split(';');
   regionIds.forEach(regionId => {    
      console.log('Subscribing to region '+regionId)
      connection.sendUTF('{"action":"sub","channel":"region:'+regionId+'"}');
      
   });
});
   
client.connect('wss://zkillboard.com/websocket/');
module.exports = app;
