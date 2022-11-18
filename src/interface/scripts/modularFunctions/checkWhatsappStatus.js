// ####################################################################################################################################
   const {getPageStatus} = require('../../web-view/modularFunctions/whatsappAutomation.js');

// ####################################################################################################################################

   module.exports = checkWhatsappStatus;

// ####################################################################################################################################
   async function checkWhatsappStatus(event, args) {
      await webview.executeJavaScript(`${getPageStatus} \n getPageStatus()`);
      return storedData.get('tmp_data').current_whatsapp_page;
   };

// ####################################################################################################################################