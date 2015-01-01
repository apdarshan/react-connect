var StorageUtils = require("./StorageUtils");

var currUser;

String.prototype.capitalize = function() {
    return this.slice(0,1).toUpperCase() + this.slice(1)
};

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
    },

    _resetBrowserActionIcon: function() {
        chrome.browserAction.setIcon({
            path: "images/icon.png"
        });
        chrome.browserAction.setBadgeText({ text: "" });
    },

    addBGListener: function(type, callback) {
        this.getBGPage().Message.on(type, callback);
    },

    init: function() {
        this._resetBrowserActionIcon();
    }
    
}
