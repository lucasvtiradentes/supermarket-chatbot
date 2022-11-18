const { remote } = require('electron');

// ####################################################################################################################################
   const {app_sending_messages_color,
          app_searching_for_messages_color,
          app_turning_off_attemp_color,
          app_turning_on_attemp_color} = require('../../../configs.json');

// ####################################################################################################################################
   module.exports = changeBotColor;

// ####################################################################################################################################
   function changeBotColor(event, task) {

      if (task === 'remove') {
         document.getElementById('botIcon').removeAttribute('style');
         document.getElementById('currentTask').innerText = 'Desativado';

      } else {

         let finalColor;
         let taskDescription;

         if (task === 'searching') {
            finalColor = app_searching_for_messages_color;
            taskDescription = 'Procurando mensagens';
         } else if (task === 'turning_on') {
            finalColor = app_turning_on_attemp_color;
            taskDescription = 'Ligando o bot';
         } else if (task === 'turning_off') {
            finalColor = app_turning_off_attemp_color;
            taskDescription = 'Desligando o bot';
         } else if (task === 'sending_messages') {
            finalColor = app_sending_messages_color;
            taskDescription = 'Enviando mensagens';
         }

         document.getElementById('botIcon').setAttribute('style', `color: ${finalColor}`);
         document.getElementById('currentTask').innerText = taskDescription;

      }
   }

// ####################################################################################################################################