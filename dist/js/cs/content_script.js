(function() {
    /*	var cssTxt = "position: absolute;z-index: 9999999 !important;width: 200px;height: 100px;right: 10px;background-color: red;top: 250px;";
    	var toaster = document.createElement("div");
    	document.body.appendChild(toaster);*/

    /*var recognition = new webkitSpeechRecognition();
	recognition.continuous = true;
	recognition.interimResults = true;

	console.log("FSDAFDSA CONENT SCRIPT");

	recognition.onresult = function(event) { 
	  console.log(event) 
	}
	recognition.start();*/

}());


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    if (request.type == "toaster") {
    	_showToaster(request.data)
		/*sendResponse({
        	farewell: "goodbye"
    	});*/
	}
});


function _getToaster() {
	var toaster = document.querySelector(".notif-toaster");
	if(!toaster) {
		toaster = document.createElement("div");
		document.body.appendChild(toaster);
	}
	toaster.className = "notif-toaster";
	return toaster;
}

function _showToaster(data) {
	var toaster = _getToaster();
	toaster.innerHTML="<div class='notif-toaster-icon'><img src='" + data.gravatar + "'/></div><span class='notif-toaster-log-info'>" + data.username + " Loggedin !! </span> ";
	toaster.classList.add("animated", "tada");

	/*Auto hide*/
	setTimeout(function(){
		toaster.classList.add("animated", "zoomOutUp");
	}, 8000);
}

