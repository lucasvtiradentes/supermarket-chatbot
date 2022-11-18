// ####################################################################################################################################
   const Store = require('electron-store');
   const storedData = new Store();
   const {timeUnitlCheckMessagesAgain} = require('../../configs.json');

// ####################################################################################################################################
   module.exports = analyzeRecievedDatabaseContent;

// ####################################################################################################################################

   async function analyzeRecievedDatabaseContent(event, pendingMessages) { // ===============================================================

      // _______________________________________________________________________
      const messagesCount = pendingMessages.length;

      // _______________________________________________________________________
      if (messagesCount === 0) {

         const line = '\n' + 'no messages to send';
         console.log(line);
         interfaceWindow.webContents.send('interface-show_message', line);
         setTimeout(() => {
            workerWindow.webContents.send('worker_check-for-pendig-messages', 'Nothing found last time');
         }, Number(timeUnitlCheckMessagesAgain * 1000));

      } else {

         const line = '\n' + `pending messages: ${messagesCount}`;
         console.log(line);
         interfaceWindow.webContents.send('interface-show_message', line);
         interfaceWindow.webContents.send('interface-send_message_to_customers', pendingMessages);

      }

   }

// ####################################################################################################################################