import { assertDeclareFunction } from "babel-types";

// Sets background color to default yellow on window load
var bkg = 0;
let bkgOld = bkg;
var lightFlag = false;
var lastMsgEl = null;
if (document.readyState != 'loading') onDocumentReady();
else document.addEventListener('DOMContentLoaded', onDocumentReady);

let timestamp, oldStamp;

function handleCommand(d) {
   //lastMsgEl.innerHTML =  `text: ${d.text} <br />int: ${d.integer} <br />float: ${d.float}`;
}

function onDocumentReady() {
    var socket = new ReconnectingWebsocket("ws://" + location.host + "/serial");
    var sendFormEl = document.getElementById('sendForm');
    var lastMsg = null;
    lastMsgEl = document.getElementById('lastMsg');
    socket.onmessage = function(evt) {
        
        // Constantly take the time and put it into a variable to be used later for comparison
      timestamp = new Date;

    //   When a button is pressed a '1' is sent to the server and it clocks bkg and the time
      if (evt.data == 1){
          ogTime = new Date;
          ogBkg = bkg;
      }

    // Pulls out the time different in seconds (instead of whole dates) and compares the time variables, if the difference is greater than 1 (second) then start to increase/decrease BKG
      if ((ogTime.getTime() - timestamp.getTime() / 1000) >= 1){
        if (evt.data == 2 && bkg < 250) bkg += 5;
        if (evt.data == 3 && bkg > 5) bkg -= 5;
      }

    //   When a 4 is recieved (from button released) check if the bkg has been altered. if it has not turn light on or off, if altered don't change the lightStae
      if (evt.data == 4 && ogBkg == bkg ){
        if (lightFlag == false){
            lightFlag = true;
        } else if (lightFlag == true) {
            lightFlag = false;
        }
      }
        // Changes the background colour from black to yellow depending on lightFlag state
        // Yellow symbolizes the britghness, the higher the bkg value is, the stronger light
    if (lightFlag == true){ 
        document.body.style.backgroundColor = "rgb(255, 255, " + bkg + ")";
    } else {
        document.body.style.backgroundColor = "black";
    }
    

            // OLD CODE, aka first iteration
            // Turned the light off/on after dimming the light. Fixed in the code above 
              // if (evt.data >= 2) {

        //     if (evt.data == 2 && bkg < 250) bkg += 5;
        //     if (evt.data == 3 && bkg > 5) bkg -= 5;
            
        // }
    //     if (evt.data == 1 ){
    //         if (lightFlag == false){
    //             lightFlag = true;
    //             //console.log("White");
    //         } else if (lightFlag == true) {
    //             lightFlag = false;
    //             //console.log("Black");
            
    //         }
    //     };
     

        // DEBUGGING CONSOLELOG
        // console.log(lightFlag);
        // console.log("d: " + bkg);
        // if (evt.data == 3) console.log("Dimming down");
        // if (evt.data == 2) console.log("Dimming up");
 
        // Parse message, assuming <Text,Int,Float>
        var d = evt.data.trim();
        if (d.charAt(0) == '<' && d.charAt(d.length-1) == '>') {
            // Looks legit
            d = d.split(',');    
            if (d.length == 3) { // Yes, it has three components as we hoped
                handleCommand({
                    text:d[0].substr(1), 
                    integer: parseInt(d[1]), 
                    float: parseFloat(d[2].substr(0,d.length-1))
                });
                return;          
            }
        }
        
        // Doesn't seem to be formatted correctly, just display as-is
        // if (evt.data != lastMsg) {
        //     lastMsgEl.innerText =  evt.data;
        //     lastMsg = evt.data;
        // }
    }
    socket.onopen = function(evt) {
        console.log("Socket opened");
    }

    sendFormEl.addEventListener('submit', function(evt) {
        evt.preventDefault();
        var send = document.getElementById('sendtoSerial').value;
        socket.send(send);  
    })
}

// Code done by Martin Wibom
// Next iteration of could could have used just tree input values from Arduino, 2 or 3 on press and 1 on release.
// When evt.data == 2 || 3 save time, bkg and the input variable. If evt.data !== 1 after 1 second, increase or decrease bkg depending on the first input value (2 or 3) until evt.data == 1. 1 will act as a stop, just like 4 does in this version.
//  Less data transfer, fewer reasons for it to bug out