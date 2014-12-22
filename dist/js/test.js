/*function change() {
        chrome.browserAction.setIcon({
            path: "images/unread.png"
        });
}*/

//chrome.browserAction.setBadgeText({text: 'C'});


// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  alert(tab);
  // No tabs or host permissions needed!
  console.log('Turning ' + tab.url + ' red!');
  chrome.tabs.executeScript({
    code: 'document.body.style.backgroundColor="red"'
  });
});