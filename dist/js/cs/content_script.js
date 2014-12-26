console.log("CS: chrome.extenion obj", chrome.extension);

chrome.runtime.onMessage.addListener(_runtimeMsgListener);


function _runtimeMsgListener(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    /*sendResponse({res: "hi there"});*/
    if (request.type === "login-toaster") {
    	var toasterInfo = { imgSrc: request.data.gravatar, msg: request.data.username + " Logged In!!" };
    	_showToaster(toasterInfo);
	} else if(request.type === "message-toaster") {
		var toasterInfo = { imgSrc: request.data.from.gravatar, msg: "Says: " + request.data.msg.text };
    	_showToaster(toasterInfo);
	} else if(request.type === "logout-toaster") {
		var toasterInfo = { imgSrc: request.data.gravatar, msg: request.data.username + " Logged Out!" };
    	_showToaster(toasterInfo);
	} else if(request.type === "listen") {
		_injectIFrame(_listen);
		/* TODO: listener to listen from iframe*/
	}
}

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
		toaster.classList.add("animated", "zoomOutUp");
	}, 8000);
}

function _listen(iframe) {
	//iframe.contentWindow.postMessage("listen", document.domain);  // cannot use post messages
	/*chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
	  console.log("RESPONSE ", response);
	});*/
	
	/*chrome.runtime.onMessageExternal.addListener(
	  function(request, sender, sendResponse) {
	    console.log("Ext msg", arguments);
	      // now the data is on your extension side, just save it to extension's localstorage.
	});*/

}

function _injectIFrame(success) {
	var iframe = document.querySelector("#reactConnectFrame");
	if(iframe) {
		success(iframe);
	} else {
		iframe = document.createElement("iframe");
		iframe.id = "reactConnectFrame";
		iframe.src = "https://localhost:3004/contentframe.html";
		iframe.onload = function() {
			success(iframe);
		};
		document.body.appendChild(iframe);
	}
}

