var path = require('path');
var WebSocketClient = require('websocket').client;
var express = require('express');
var axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
console.log((new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''))+ " Starging up..");
var app = express();

var client = new WebSocketClient();


if (!process.env.HOST_URL) {
   console.error("Aborting start: HOST_URL environment variable is unset.");
   process.exit(2);
}
else {
   console.log('HOST URL: '+process.env.HOST_URL);
}

if (!process.env.PASSCODE) {
   console.error("Aborting start: PASSCODE environment variable is unset.");
   process.exit(2);
}
else {
   console.log('PASSCODE: '+process.env.PASSCODE);
}

if (!process.env.REGION_IDS) {
   console.error("Aborting start: REGION_IDS environment variable is unset.");
   process.exit(2);
}
else {
   console.log('REGION_IDS: '+process.env.REGION_IDS);
}


var zkillHost = 'wss://zkillboard.com/websocket/';
if (process.env.ZKILLBOARD_HOST) {
   console.error("Setting alternative zKillboard host: "+process.env.ZKILLBOARD_HOST);
   zkillHost = process.env.ZKILLBOARD_HOST;
}


client.on('connectFailed', (error) => {
      console.log('Connect Error: ' + error.toString() + " - exiting.");
      process.exit(1);
   });

client.on('connect', (connection) => {
      console.log('Connected to ' + zkillHost + ' via websocket.');
      connection.on('error', function (error) {
         console.log((new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''))+ " Connection Error: " + error.toString());
         process.exit(3);
      });


      connection.on('close', () => {
            console.log((new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''))+ " Connection Closed - reconnecting.");
            client.connect(zkillHost);
            // process.exit(4);
         });
      connection.on('message', (message) => {
            if (message.type === 'utf8') {

               var message_id = uuidv4();
               console.time('Message processing ' + message_id);
               //        console.log("Received: '" + message.utf8Data + "'");
               axios.post(process.env.HOST_URL, {
                  killmail: message,
                  passcode: process.env.PASSCODE
               })
                  .then(res => {
                     console.timeEnd('Message processing ' + message_id);
                  })
                  .catch(error => {
                     console.error('Could not send littlekill to Abyss Tracker - ' + error.message);
                     console.error(error.response.data ? error.response.data : "Unknown error");
                     console.timeEnd('Message processing ' + message_id);
                  });
            }
         });

      console.time("Channels subscribing");
      var regionIds = process.env.REGION_IDS.split(';');
      regionIds.forEach(regionId => {
         console.log('Subscribing to region ' + regionId);
         connection.sendUTF('{"action":"sub","channel":"region:' + regionId + '"}');
      });
      console.timeEnd("Channels subscribing");
      console.log((new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''))+ " Kybernaut bridge is up and connected.");
   });
   
console.time("Websocket connecting");
client.connect(zkillHost);
console.timeEnd("Websocket connecting");


module.exports = app;
