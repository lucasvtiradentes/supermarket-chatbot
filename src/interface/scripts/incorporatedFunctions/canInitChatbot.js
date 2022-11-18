// ####################################################################################################################################

   function canInitChatbot(option) {

      if (option === 'enable') {

         el_activateChatbot.removeAttribute('disabled');

      } else if (option === 'disable') {

         el_activateChatbot.setAttribute('disabled', '');

      }

   }

// ####################################################################################################################################