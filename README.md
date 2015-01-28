TODO: ngrock steps
React-Connect
=============

React Connect (A Google Chrome browser extension) is a chat app using http://material-ui.com/, http://facebook.github.io/flux/, http://facebook.github.io/react/ and http://socket.io/

Clone this repo and follow below steps to run the app

### Run Server
- Install NodeJS using http://nodejs.org/
- Go to ``server`` directory & run ``npm install`` using command line (installs node dependencies)
- :point_down:And run command ``node index.js`` to start the servers  - http (@ port 3003) and https (@ port 3004)
- Install ngrok https://ngrok.com and add it to you env PATH variable
- Run ``ngrok 3003`` from command line. You will get Tunnel details,
- Copy Secure ``Forwarding address`` eg. https://<generated_random_no>.ngrok.com
- Replace all occurances(around 8) of old ngrok address(https://5f24a071.ngrok.com) with new copied one (https://<generated_random_no>.ngrok.com) in entire react-connect source code.

### Run Browserify watcher
- Using command line ``npm install`` in the root directory of the project (installs node dependencies)
- Run ``npm start`` in command line to start watcher (creates ``dist/js/bundle.js``)
- Use ``dist`` directory to pack as chrome extension
	- Open ``chrome://extensions`` in Google Chrome browser
	- Drag your ``dist`` directory from the file system and drop on ``chrome://extensions`` page
	- Enable ``Developer Mode`` by clicking on checkbox
	- :angry: Copy ``ID`` of our dropped ``Connect`` app & paste it at line no.44 in ``server/contentframe.js``

### Granting permissions (one time)
- SSL permission for localhost
	- In a Chrome tab Open ``https://localhost:3004/contentframe.html``
	- Click on ``Advanced``
	- Click on ``Proceed to localhost (unsafe)``
- Enabling Microphone access
	- On opening of ``https://localhost:3004/contentframe.html`` first time, Once you ssl permission is success, You will get a popup asking permission to access microphone
	- Click ``Allow``

### Run App - Finally!
- Open any website in chrome (except built in browser pages :bulb:) 
- Click on ``CONNECT`` extension icon
- Enter email address for the first-time
- Click on ``JOIN`` button & Enjoy


NOTES:
- :point_down: Eventually servers should be running in a public address so that users can chat across machines.
- :angry: This annoyance will be removed eventually
- :bulb: Injecting iframe to webpages(using content script) to use ``WebkitSpeechRecognition`` api. Since we cannot inject content scripts to browser's default pages. We should be in a website to use extension's voice input.

