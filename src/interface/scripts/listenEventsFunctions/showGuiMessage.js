// ####################################################################################################################################

   const dialog = require('electron').remote.dialog;

// ####################################################################################################################################

   module.exports = showGuiMessage;

// ####################################################################################################################################

   function showGuiMessage(event, messageContent) { // ==================================================================

      const {title, message, description} = messageContent;

      const options = {
         type      : 'question',
         buttons   : ['Ok'],
         defaultId : 2,
         title     : title,
         message   : message,
         detail    : description,
         // checkboxLabel: 'Remember my answer',
         // checkboxChecked: true,
      };

      dialog.showMessageBox(null, options, (response) => {
         console.log(response);
      });

   }

// ####################################################################################################################################