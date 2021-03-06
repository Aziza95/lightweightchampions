//
var lastMsgEl = null;
if (document.readyState != 'loading') onDocumentReady();
else document.addEventListener('DOMContentLoaded', onDocumentReady);

function handleData(obj) {
  // At this point we could call functions based on received data etc.
  // eg: if (obj.x > 10) runThis()
}

function onDocumentReady() {
  var socket = new ReconnectingWebsocket('ws://' + location.host + '/serial');
  var sendFormEl = document.getElementById('sendForm');
  var lastMsg = null;
  lastMsgEl = document.getElementById('lastMsg');

  // Handle incoming messages
  socket.onmessage = function (evt) {
    var d = evt.data.trim();
    var obj = {};
    try {
      obj = JSON.parse(d);
    } catch (e) {
      if (d === lastMsg) return; // Don't repeat
      lastMsgEl.innerText = 'Couldn\'t parse, see console for details.';
      console.log(e);
      console.log('Received: ' + d);
      lastMsg = d;
      return;
    }

    // Pass parsed object over to a function to handle
    handleData(obj);

    // Display data for debug purposes
    if (d !== lastMsg) {
      // Don't update display if it's the same as before
      lastMsgEl.innerText = d;
    }
  };
  socket.onopen = function (evt) {
    console.log('Socket opened');
  };

  //Above code by Clint Heyer, credits (https://github.com/ClintH/interactivity/tree/master/websockets/json-serial-bridge)

  // If annyang has run successfully, execute the following code;
  if (annyang) {

    // Relevant functions which the annyang software will refer to through the "declared commands" specified further down.

    // Function which the voice commands will execute once recognized. This is for the lights off command.
    let lightsOff = function () {
      //Send value to form
      document.getElementById("sendtoSerial").value = "{\off\:1}";


    };
    
    // Function which the voice commands will execute once recognized. This is for the lights on command.
    let lightsOn = function () {
      //Send value to form
      document.getElementById("sendtoSerial").value = "{\on\:1}";

    };

    // Function which the voice commands will execute once recognized. This is for confirming the voice commands, and sending it to the serial. 
    let confirm1 = function (evt) {
      var send = document.getElementById('sendtoSerial').value;
      socket.send(send);

    };

    //Declare usable lights, in other words, physical lights which are tied to a specific variable/value. In this case, led lights. 
    let usableLights = ["a", "b", "c"];

    //Command function tied to the annyang command for specific lights On. Validation form.
    //For the purpose of checking through various specified lights.
    let lightNotationOn = function (tag) {
      if (typeof tag === "string" && tag.length === 1) {
        console.log(`Command ${tag} recognized, letter confirmed. `);

        //Annyang sometimes capitalizes letters, here we're turning them lower case. Case matters.
        tag = tag.toLowerCase();

        //For loop which iterates through usableLights, checking if any of them match with the user input.
        for (i = 0; i <= usableLights.length; i++) {

          //If tag matches with a value in UsableLights, do the following:
          if (tag === usableLights[i]) {

            //If the user input matches with the possible named values from UsableLights, send it to the form for confirmation.
            document.getElementById("sendtoSerial").value = `{\ ${tag}1 \:1}`;

            //Console log results, that everthing went smoothly. Only confirm remains.
            console.log(`The light with ${tag} was found, and is ready to be activated. Confirm`);
            break;
          } else {
            //If the confirmed letter string does not match with anything in the database:
            if (i === usableLights.length && tag != usableLights[i]) {

              //Console log result of no matching data being found in usableLights.
              console.log(`Unfortunately the light with ${tag} is not connected to any light of the corresponding letter.`);

            }
          }
        }
      } else {
        //Console log result of the input is not a string, and/or is not longer than 1 letter.
        console.log(`Parameter ${tag} is either not a word, or not a singular letter.`);
      }
    };

    //Command function tied to the annyang command for specific lights Off. Validation form.
    //For the purpose of checking through various specified lights.
    let lightNotationOff = function (tag) {
      if (typeof tag === "string" && tag.length === 1) {
        console.log(`Command ${tag} recognized, letter confirmed. `);

        //Annyang sometimes capitalizes letters, here we're turning them lower case. Case matters.
        tag = tag.toLowerCase();

        //For loop which iterates through usableLights, checking if any of them match with the user input.
        for (i = 0; i <= usableLights.length; i++) {

          //If tag matches with a value in UsableLights, do the following:
          if (tag === usableLights[i]) {

            //If the user input matches with the possible named values from UsableLights, send it to the form for confirmation.
            document.getElementById("sendtoSerial").value = `{\ ${tag}0 \:1}`;

            //Console log results, that everthing went smoothly. Only confirm remains.
            console.log(`The light with ${tag} was found, and is ready to be activated. Confirm`);
            break;
          } else {
            //If the confirmed letter string does not match with anything in the database:
            if (i === usableLights.length && tag != usableLights[i]) {

              //Console log result of no matching data being found in usableLights.
              console.log(`Unfortunately the light with ${tag} is not connected to any light of the corresponding letter.`);

            }
          }
        }
      } else {
        //Console log result of the input is not a string, and/or is not longer than 1 letter.
        console.log(`Parameter ${tag} is either not a word, or not a singular letter.`);
      }
    };

    // Declared commands. Here, voice commands (words to be recognized), are declared and paired with a previously mentioned relevant function.
    let commands = {
      'Lights off': lightsOff,
      'Lights on': lightsOn,
      'Confirm': confirm1,
      'Turn on light *tag': lightNotationOn,
      'Turn off light *tag': lightNotationOff,
    };

    // An optional debug mode for detailed logging in the console. Left intact for legacy and developer needs.
    annyang.debug();

    // Add the voice commands. Here, the declared commands are added to the current session of annyang.
    annyang.addCommands(commands);

    // Set a language for speech recognition. For the purpose of this prototype, English was chosen. 
    annyang.setLanguage('en');

    /* Tell Annyang to start listening for voice commands and recognize them. You can call this here, or attach this call to an event, button, etc. 
    However for this purpose I have chosen for it to activate on load. */
    annyang.start();
  } else {
    $(document).ready(function () {
      $('#unsupported').fadeIn('fast');
    });
  }

}


//Code by Jovan