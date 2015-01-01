var timer;

chrome.runtime.onMessage.addListener(_runtimeMsgListener);


function _runtimeMsgListener(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    /*sendResponse({res: "hi there"});*/
    if (request.type === "login-toaster" && request.data) {
    	var toasterInfo = { 
    		imgSrc: request.data.gravatar, 
    		msg: request.data.username + " Logged In!!",
    		autoHide : { 
				interval: 3000, 
				animateClass: "bounceOut"
			}
    	};
    	_showPlainToaster(toasterInfo);
	} else if(request.type === "message-toaster" && request.data) {
		var toasterInfo = {
			imgSrc: request.data.from.gravatar, 
			msg: "Says: " + request.data.msg.text, 
			autoHide : { 
				interval:8000, 
				animateClass: "hinge"
			}
		};
    	_showPlainToaster(toasterInfo);
	} else if(request.type === "logout-toaster" && request.data) {
		var toasterInfo = { 
			imgSrc: request.data.gravatar, 
			msg: request.data.username + " Logged Out!", 
			autoHide : {
				interval:8000, 
				animateClass: "hinge"
			}
		};
    	_showPlainToaster(toasterInfo);
	} else if(request.type === "request-toaster" && request.from) {
		var toasterInfo = {
			imgSrc: request.from.gravatar, 
			msg: request.from.username + " wants to chat with you!", 
			friend: request.from 
		};
    	_showActionToaster(toasterInfo);
	} else if(request.type === "listen") {
		_injectIFrame(_listen);
		/* FIXME: listener to listen from iframe, now its starts listening on injection*/
	}
}

function _getPlainToaster() {
	var toaster = document.querySelector(".notif-plain-toaster");
	if(!toaster) {
		toaster = document.createElement("div");
		document.body.appendChild(toaster);
	}
	toaster.className = "notif-toaster notif-plain-toaster";
	return toaster;
}

function _showPlainToaster(info) {
	var toaster = _getPlainToaster();
	toaster.innerHTML="<div class='notif-toaster-icon'><img src='" + info.imgSrc + "'/>"+
					"</div><span class='notif-toaster-log-info'>" + info.msg + " </span> ";
	toaster.classList.add("animated", "tada");

	/*Auto hide notification*/
	if(info.autoHide) {
		_autoHideToaster(toaster, info.autoHide);
	}
}

/*sending msg to background page*/
function _sendMsgtoBG(msg, success) {
	chrome.runtime.sendMessage(msg, success);
}


function _getActionToaster() {
	var toaster = document.querySelector(".notif-action-toaster");
	if(!toaster) {
		toaster = document.createElement("div");
		document.body.appendChild(toaster);
		toaster.addEventListener("click", function(e) {
			if(e.target.tagName === "BUTTON") {
				var friend = JSON.parse(e.target.parentElement.dataset.friend);
				_sendMsgtoBG({
					type: "request-toaster-action", 
					value: {
						friend: friend,
						action: e.target.value
					}
				}, function(response) {
				  console.log("REQUEST TOASTER RESPONSE ", response);
				});
				document.body.removeChild(toaster);
			}
		});
	}
	toaster.className = "notif-action-toaster notif-toaster";
	return toaster;
}

function _showActionToaster(info) {
	var toaster = _getActionToaster(info);
	toaster.innerHTML = "<div class='notif-toaster-icon'><img src='" + info.imgSrc + "'/>" + 
						"</div><span class='notif-toaster-log-info'>" + info.msg + " </span> " + 
						"<div class='notif-actions' data-friend='"+ JSON.stringify(info.friend) +"''>"+
						"<button class='acceptReq' value='accept'>Accept</button>"+
						"<button class='rejectReq' value='reject'>Reject</button></div>";
	toaster.classList.add("animated", "rubberBand");
}

function _autoHideToaster(toaster, hideConf) {
	if(timer) {
		window.clearTimeout(timer);
	}
	timer = window.setTimeout(function(){
		toaster.classList.add("animated", hideConf.animateClass);
	}, hideConf.interval);
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

