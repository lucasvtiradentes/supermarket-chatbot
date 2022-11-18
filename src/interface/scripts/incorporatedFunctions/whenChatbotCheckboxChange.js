// ####################################################################################################################################

   function whenChatCheckBoxChange(isFirstTime) {

      if (el_activateChatbot.checked) {
         remote.getCurrentWindow().send('interface-change_bot_color', 'turning_on');
         canChangeSettings('disable');
         ipcRenderer.send('main_init_looping', 'bot init');
      } else {
         canChangeSettings('enable');
         if (!isFirstTime) {
            remote.getCurrentWindow().send('interface-change_bot_color', 'turning_off');
         }
         remote.getGlobal('sharedProperties').lookingForMessages = false;
      }
   }

// ####################################################################################################################################