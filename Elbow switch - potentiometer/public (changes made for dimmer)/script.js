var lastMsgEl = null;
if (document.readyState != 'loading') onDocumentReady();
else document.addEventListener('DOMContentLoaded', onDocumentReady);

function handleCommand(d) {
   lastMsgEl.innerHTML =  `text: ${d.text} <br />int: ${d.integer} <br />float: ${d.float}`;
}

function onDocumentReady() {
    var socket = new ReconnectingWebsocket("ws://" + location.host + "/serial");
    var sendFormEl = document.getElementById('sendForm');
    var lastMsg = null;
    lastMsgEl = document.getElementById('lastMsg');
    socket.onmessage = function(evt) {
       
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
        // runs the function that reads the value of the potentiometer (new function)
        addedFunctionality(evt.data);
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
// hsl color scale (new function)
function rainbow(data) {
    let c;
    //maps the values from arduino to 0-100 because of hsl scale.  
    let u = scale(data, 0, 250, 0, 100);

    c = 'hsl(0, 0%, ' + u + '%)';

    console.log(u);
    return c;
}
// changes the color of the body's background (new function)
function colourPick(data) {
    document.body.style.background = rainbow(data);
}
// reads the value and calls on the colourPick function (new function)
function addedFunctionality(data){
    //console.log(msg);
    colourPick(data);
}

//added function for scaling arduino values (new function)
const scale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }