// ####################################################################################################################################
const {getLastSentMessageStatus} = require('../../web-view/modularFunctions/whatsappAutomation.js');

// ####################################################################################################################################

   module.exports = checkLastMessageStatus;

// ####################################################################################################################################
   async function checkLastMessageStatus(messageInitialContent) {

      let messageCompareContent;
      messageCompareContent = messageInitialContent.replace(/[\W_]+/g, '');
      messageCompareContent = messageCompareContent.substr(0, 200);

      await webview.executeJavaScript(`${getLastSentMessageStatus} \n getLastSentMessageStatus("${messageCompareContent}")`);
      return storedData.get('tmp_data').last_sent_message_status;
   };

// ####################################################################################################################################