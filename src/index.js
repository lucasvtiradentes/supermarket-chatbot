const isDev = require('electron-is-dev');
const { app, session } = require('electron');
const { join, resolve } = require('path');

if (isDev) {
   require('dotenv').config();
} else {
   require('dotenv').config({ path: resolve(__dirname, '../.env') });
}

global.interfaceWindow = null;
global.workerWindow = null;
global.database = null;
global.sharedProperties = {
   countLoadedWindows: 0,
   lookingForMessages: false
};

const appSettingsLocation = join(app.getPath('userData'), '../market-chatbot');
app.setPath('userData', appSettingsLocation);

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {

   console.log('second instance is not allowed!');
   app.quit();

} else {

   app.on('ready', main);

   app.on('quit', async function () {
      console.log('\n' + '#### CHATBOT CLOSED #######################################################################' + '\n');
   });

   app.on('second-instance', () => {
      if (interfaceWindow) {
         if (interfaceWindow.isMinimized()) interfaceWindow.restore();
         interfaceWindow.focus();
      }
   });

}

async function main() {
   console.log('#### LOADING WINDOWS ######################################################################' + '\n');

   const agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36';
   session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
      details.requestHeaders['User-Agent'] = agent;
      callback({ cancel: false, requestHeaders: details.requestHeaders });
   });

   require('./main/mainListenEvents.js');

   interfaceWindow = require('./main/modularFunctions/createMainWindow.js')();
   workerWindow = require('./worker/modularFunctions/createWorkerWindow.js')();
}
