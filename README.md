react-connect
=============

React Connect (A Google Chrome browser extension) is a chat app with Google Material-UI Design using http://socket.io/, http://material-ui.com/ and http://facebook.github.io/flux/


Run Server
- Go to ``server`` direcoty & run ``npm install`` using command line (installs node dependencis)
- *And run command ``node index.js`` to start the servers  - http (@ port 3003) and https (@ port 3004)

Run Browserify watcher
- Using command line ``npm install`` in the root directory of the project (installs node dependencies)
- Run ``npm start`` in command line to start wathcer (creates ``dist/js/bundle.js``)
- Use ``dist`` directory to pack as chrome extension
	- Open ``chrome://extensions`` in Google Chrome browser
	- Drag your ``dist`` directory from the file system and drop on ``chrome://extensions`` page
	- Enable ``Developer Mode`` by clicking on checkbox
	- Copy ``ID`` of our dropped ``Connect`` app & paste it at line no.44 in ``server/contentframe.js``

One time Microphone Permission
- SSL permission for localhost
	- In a Chrome tab Open ``https://localhost:3004/contentframe.html``
	- Click on ``Advanced``
	- Click on ``Proceed to localhost (unsafe)``
- Enabling Microphone access
	- On opening of ``https://localhost:3004/contentframe.html`` first time, Once you ssl permission is success, You will get a popup asking permission to access microphone
	- Click ``Allow``

Run App - Finally!
- **Open any website in chrome (except built in browser pages) 
- Click on ``CONNECT`` extension icon
- Enter email address for the firsttime
- Click on ``JOIN`` button & Enjoy


NOTES:
1. *Eventually servers should be running in a public address so that users can chat across machines.
2. **Injecting iframe to webpages(using content script) to use ``WebkitSpeechRecognition`` api. Since we cannot inject contentscripts to browser's default pages. We should be in any website to use extension's voice input.
