// ####################################################################################################################################

   const checkConditions = require('../modularFunctions/checkConditions.js');

// ####################################################################################################################################

   module.exports = initLooping;

// ####################################################################################################################################

   async function initLooping() { // ===================================================================================

      // -----------------------------------------------------------------------
      const allWindowAreLoaded = sharedProperties.countLoadedWindows >= 3 ? true : false;

      if (!allWindowAreLoaded) {
         setTimeout(function() {
            initLooping();
         }, Number(2000));

         return;
      }

      const areConditionsAllSatisfied = await checkConditions();

      // -----------------------------------------------------------------------
      if (areConditionsAllSatisfied === true) {
         console.log('\n' + '#### LOOKING FOR MESSAGES #################################################################' + '\n');
         sharedProperties.lookingForMessages = true;
         interfaceWindow.webContents.send('interface-change_bot_color', 'searching');
         workerWindow.webContents.send('worker_check-for-pendig-messages', 'Nothing found last time');
      } else {
         await interfaceWindow.webContents.executeJavaScript('document.getElementById(\'activateChatbot\').click()');
         interfaceWindow.webContents.send('interface-show_gui_message', {titile: 'Não foi possível iniciar o bot', message: areConditionsAllSatisfied, description: ''});
         interfaceWindow.webContents.send('interface-change_bot_color', 'remove');
      }

   }

// ####################################################################################################################################
