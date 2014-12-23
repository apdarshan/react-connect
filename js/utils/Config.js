var StorageUtils = require("./StorageUtils");

var currUser;

module.exports = {

    /*To be called after browser action*/
    getUserSync: function() {
        if(!currUser) {
            throw new Error("User not yet looged in");
        }
        return currUser;
    },

    getUser: function() {
        return new Promise(function(resolve, reject) {
            StorageUtils.getExtStorage("user").then(function(user){
                console.error("Not Found", user);
                currUser = user;
                resolve(user);
            }, function(er){
                console.log(er);
                reject();
            });
        });
    },

    getBGPage: function() {
        return chrome.extension.getBackgroundPage();
    },

    getBGSocket: function() {
        return this.getBGPage().Socket.get();
    }
    
}
