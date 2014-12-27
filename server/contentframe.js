console.log("CF Runtime", chrome.runtime);
console.log("CF Extension", chrome.extension);

//var port = chrome.runtime.connect({name: "knockknock"});
//port.postMessage({joke: "Knock knock"});

/*port.onMessage.addListener(function(msg) {
	console.log("CFFFF res", msg);
  	if (msg.question == "Who's there?")
    	port.postMessage({answer: "Madame"});
  	else if (msg.question == "Madame who?")
    	port.postMessage({answer: "Madame... Bovary"});
});
*/


_listen();

function _listen() {
    var recognition = new webkitSpeechRecognition();
    var final_transcript = '';

    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.start();

    recognition.onstart = function() { 
      console.log("SPEECH START");
    };

    recognition.onresult = function(event) {
        var interim_transcript = '';

        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
        final_transcript = final_transcript;
        /*Paste your extension id found under chrome://extensions page*/
        chrome.runtime.sendMessage("lkfgmgohhglpaeboopbhlhfnlilphjah", {data: { msg : final_transcript}});

    };

    recognition.onerror = function(event) { 
      console.log("SPEECH ERRR", event); 
    };
    recognition.onend = function() { 
      console.log("SPEECH END");
    };
}