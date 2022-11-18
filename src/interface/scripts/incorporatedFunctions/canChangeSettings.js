// ####################################################################################################################################

   /* exported canChangeSettings */

   function canChangeSettings(option) {

      if (option === 'enable') {

         // console.log('allow');

         el_marketClosingTime.removeAttribute('disabled');
         el_marketName.removeAttribute('disabled');

         el_analysedDate.removeAttribute('disabled');
         el_messagesDestination.removeAttribute('disabled');

         el_marketSameDayDeliveryTime.removeAttribute('disabled');

         el_chatbotKey.removeAttribute('disabled');
         el_testCellPhone.removeAttribute('disabled');

      } else if (option === 'disable') {

         // console.log('dont allow');

         el_marketClosingTime.setAttribute('disabled', '');
         el_marketName.setAttribute('disabled', '');

         el_analysedDate.setAttribute('disabled', '');
         el_messagesDestination.setAttribute('disabled', '');

         el_marketSameDayDeliveryTime.setAttribute('disabled', '');

         el_chatbotKey.setAttribute('disabled', '');
         el_testCellPhone.setAttribute('disabled', '');

      }

   }

// ####################################################################################################################################