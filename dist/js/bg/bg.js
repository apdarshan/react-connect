(function(){

	var CHAT_SOCKET_DOMAIN = "http://localhost:3003";
	window._socket = io.connect(CHAT_SOCKET_DOMAIN);


	function _includeContentScript(){

		return new Promise(function(resolve, reject) {
			chrome.tabs.insertCSS({
				file: "css/cs/animate.css"
			},function(){
		  		chrome.tabs.insertCSS({
					file: "css/cs/main.css"
				},function(){
			  		console.log("Content CSS Loaded");
			  		chrome.tabs.executeScript({
						file: "js/cs/content_script.js"
				  	}, function(){
				  		console.log("Content Script Included");
				  		resolve();
				  	});
			  	});
		  	});
		});
	}

	_socket.on("new user login", function(user){
		_includeContentScript().then(function(){
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				console.log("Error", user);
	  			chrome.tabs.sendMessage(tabs[0].id, {type: "toaster", data: user}, function(response) {
			   		//console.log("RESPONSE From CS:", response.farewell);
				});
			});
		});
	});

	_socket.on("user logged out", function(user){
		console.log("An user Logged OUT", user);
	});


}());

chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  console.log('Turning ' + tab.url + ' red!');
  chrome.tabs.executeScript({
    code: 'document.body.style.backgroundColor="red"'
  });
});