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
    if (request.type === "login-toaster") {
    	var toasterInfo = { imgSrc: request.data.gravatar, msg: request.data.username + " Logged In!!" };
    	_showToaster(toasterInfo);
		/*sendResponse({
        	farewell: "goodbye"
    	});*/
	} else if(request.type === "message-toaster") {
		var toasterInfo = { imgSrc: request.data.from.gravatar, msg: "Says: " + request.data.msg.text };
    	_showToaster(toasterInfo);
	} else if(request.type === "logout-toaster") {
		var toasterInfo = { imgSrc: request.data.gravatar, msg: request.data.username + " Logged Out!" };
    	_showToaster(toasterInfo);
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

function _showToaster(info) {
	var toaster = _getToaster();
	toaster.innerHTML="<div class='notif-toaster-icon'><img src='" + info.imgSrc + "'/></div><span class='notif-toaster-log-info'>" + info.msg + " </span> ";
	toaster.classList.add("animated", "tada");

	/*Auto hide*/
	setTimeout(function(){
		//toaster.classList.add("animated", "zoomOutUp");
	}, 8000);
}

