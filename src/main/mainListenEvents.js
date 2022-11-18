// ####################################################################################################################################
   const {ipcMain} = require('electron');

// ####################################################################################################################################

   ipcMain.on('main_loaded-window', async(event, arg) => { // ===============================================================

      sharedProperties.countLoadedWindows = Number(sharedProperties.countLoadedWindows) + 1;

      if (sharedProperties.countLoadedWindows <= 3) {
         console.log(`[${sharedProperties.countLoadedWindows}] -> [${arg}]`);

         if (Number(sharedProperties.countLoadedWindows) === 3) {
            await require('./modularFunctions/executeAfterLoadAllWindows.js')();
         }
      }

   });

// ####################################################################################################################################

   ipcMain.on('main_analyze-received-database-content', require('./listenEventsFunctions/analyzeReceivedDatabaseContent.js'));

   ipcMain.on('main_init_looping', require('./listenEventsFunctions/initLooping.js'));

   ipcMain.on('main_show-cli-message', require('./listenEventsFunctions/showCliMessage.js'));

// ####################################################################################################################################