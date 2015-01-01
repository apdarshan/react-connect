

module.exports = {
        getLocalStorage: function(key) {
            return JSON.parse(localStorage.getItem(key));
        },
        setLocalStorage: function(key, obj) {
            localStorage.setItem(key, JSON.stringify(obj));
        },
        setExtStorage: function(key, obj) {
        	return new Promise(function(resolve, reject){
        		var data = {};
        		data[key] = obj;
        		chrome.storage.local.set(data, function() {
		          // Notify that we saved.
		          console.log('Settings saved');
		          resolve();
		        });
        	});
        },
        getExtStorage: function(key) {
        	return new Promise(function(resolve, reject){
        		chrome.storage.local.get(key, function(value) {
	        		resolve(value[key]);
	        	});
        	});
        }
};