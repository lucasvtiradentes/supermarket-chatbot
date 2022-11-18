// ####################################################################################################################################
   const {remote, ipcRenderer} = require('electron');
   const Store = require('electron-store');
   const storedData = new Store();

   const database_message_collection = process.env.DATABASE_MESSAGE_COLLECTION_NAME;
   const {greetingMessage, occurrencesMessage, readyForPickupMessage} = require('../modularFunctions/generateCustomerMessage.js');
   const genereteDetailedCustomerObject = require('../modularFunctions/generateDetailedCustomerObject.js');
   const checkWhatsappStatus = require('../modularFunctions/checkWhatsappStatus.js');
   const checkLastMessageStatus = require('../modularFunctions/checkLastMessageStatus.js');
   const updateCharts = require('../modularFunctions/updateCharts.js');
   const updateTables = require('../modularFunctions/updateTables.js');

   const {waitForEnterChatButton,
      clickEnterWhatsappButton,
      waitPageGetReady,
      waitLoadingPage,
      waitForSendButton,
      clickSendButton} = require('../../../interface/web-view/modularFunctions/whatsappAutomation.js');

// ####################################################################################################################################

   module.exports = send_message;

// ####################################################################################################################################

   async function send_message(event, customers) { // ==================================================================

      let progressBarTotal = 0;
      const progressBarIteration = Number(1 / customers.length);
      remote.getCurrentWindow().send('interface-change_bot_color', 'sending_messages');

      for (let x = customers.length - 1; x >= 0; x--) {

         // ____________________________________________________________________
         const disableChecking = Boolean(remote.getGlobal('sharedProperties').lookingForMessages);

         if (disableChecking === false) {
            break;
         }

         // ____________________________________________________________________
         const pendingMessages = x + 1;
         document.getElementById('pendingMessages').innerText = pendingMessages;
         storedData.set('message_stats_data.pending_messages', pendingMessages);
         console.log(`pending ${pendingMessages} -> ${customers[x].customer_name} ----------------`);
         updateCharts();
         updateTables();

         // ____________________________________________________________________
         const customer = genereteDetailedCustomerObject(customers[x]);
         const testNumber = getFixedPhone(storedData.get('message_settings').test_phone_number);
         const customerNumber = getFixedPhone(customer.customer_phone);
         const messageType = customer.message_type;
         const PhoneNumberToSend = storedData.get('message_settings').message_destination === 'Número de testes' ? testNumber : customerNumber;
         const messageText = generateCustomerMessage(customer);
         const linkSendMessage = `https://api.whatsapp.com/send?phone=${PhoneNumberToSend}&text=${encodeURIComponent(messageText)}`;

         // ____________________________________________________________________
         let messageResult;
         if (messageText === false) {

            await updateMessageOnDatabase(customer.message_id, 'unrequired');
            messageResult = 'unrequired';

         } else {

            try {
               await webview.loadURL(linkSendMessage);
               await webview.executeJavaScript(`${waitPageGetReady} \n waitPageGetReady()`);
               await webview.executeJavaScript(`${waitForEnterChatButton} \n waitForEnterChatButton()`);
               await webview.executeJavaScript(`${clickEnterWhatsappButton} \n clickEnterWhatsappButton()`);
               await webview.executeJavaScript(`${waitLoadingPage} \n waitLoadingPage()`);
               await webview.executeJavaScript(`${waitPageGetReady} \n waitPageGetReady()`);

               const whatsappScreen = await checkWhatsappStatus();
               console.log(whatsappScreen);

               if (whatsappScreen === 'Logado') {

                  await webview.executeJavaScript(`${waitForSendButton} \n waitForSendButton()`);
                  await webview.executeJavaScript(`${clickSendButton} \n clickSendButton()`);
                  await webview.executeJavaScript(`${waitPageGetReady} \n waitPageGetReady()`);

                  let hasSentMessage;
                  while (hasSentMessage !== true) {

                     const messageStatus = await checkLastMessageStatus(messageText);
                     hasSentMessage = messageStatus === 'sent' ? true : false;
                     console.log(messageStatus + ' -> ' + hasSentMessage);

                     await new Promise(resolve => setTimeout(resolve, Number(2000)));
                  }

                  await updateMessageOnDatabase(customer.message_id, 'sent');
                  messageResult = 'sent';

               } else if (whatsappScreen === 'Número inválido') {

                  await updateMessageOnDatabase(customer.message_id, 'error');
                  messageResult = 'error';

               }

            } catch (e) {
               // Não deu por alguma razão, mas o número é válido
            }

         }
         // --------------------------------------------------------------------
         if (messageResult === 'sent') {
            storedData.set(`message_stats_data.total_sent_messages.${messageType}`, Number(storedData.get(`message_stats_data.total_sent_messages.${messageType}`)) + 1);
            storedData.set(`message_stats_data.today_sent_messages.${messageType}`, Number(storedData.get(`message_stats_data.today_sent_messages.${messageType}`)) + 1);

            let sentArr = storedData.get('message_stats_data.last_sent_messages');
            sentArr = [getSentTableCustomerFields(customer), ...sentArr];
            storedData.set('message_stats_data.last_sent_messages', sentArr);

            ipcRenderer.send('main_show-cli-message', `message sent: ${messageType} - ${customer.order_detailed_info.customer_first_name} - ${customer.customer_phone} - ${customer.market_name}`);
         } else if (messageResult === 'error') {

            console.log(messageText);
            customer.generatedMessage = messageText;
            let arrError = storedData.get('message_stats_data.error_messages');
            arrError = [getErrorTableCustomerFields(customer), ...arrError];
            storedData.set('message_stats_data.error_messages', arrError);

            ipcRenderer.send('main_show-cli-message', `message error: ${messageType} - ${customer.order_detailed_info.customer_first_name} - ${customer.customer_phone} - ${customer.market_name}`);
         } else if (messageResult === 'unrequired') {

            ipcRenderer.send('main_show-cli-message', `message unrequired: ${messageType} - ${customer.order_detailed_info.customer_first_name} - ${customer.customer_phone} - ${customer.market_name}`);

         }

         // --------------------------------------------------------------------
         storedData.set('message_stats_data.last_sent_message_date', storedData.get('tmp_data').current_date);

         // --------------------------------------------------------------------
         progressBarTotal = progressBarTotal + progressBarIteration;
         remote.getCurrentWindow().setProgressBar(Number(progressBarTotal));
         console.log(' ');
      }

      // _______________________________________________________________________
      storedData.set('message_stats_data.pending_messages', 0);
      updateCharts();
      updateTables();
      remote.getCurrentWindow().setProgressBar(0);
      document.getElementById('pendingMessages').innerText = '';
      remote.getCurrentWindow().send('interface-change_bot_color', 'searching');
      remote.getGlobal('workerWindow').webContents.send('worker_check-for-pendig-messages', 'Found something last time');
   }

   function generateCustomerMessage(customerData) { // =================================================================

      if (customerData.message_type === 'greeting') {
         return greetingMessage(customerData);
      } else if (customerData.message_type === 'occurrences') {
         return occurrencesMessage(customerData);
      } else if (customerData.message_type === 'ready_for_pickup') {
         return readyForPickupMessage(customerData);
      } else {
         return false;
      }

   }

   function getFixedPhone(originalPhone) { // ==========================================================================
      let phoneNumber;
      phoneNumber = '55' + originalPhone;
      phoneNumber = phoneNumber.replace('(', '');
      phoneNumber = phoneNumber.replace(')', '');
      phoneNumber = phoneNumber.replace('-', '');
      phoneNumber = phoneNumber.replace(' ', '');

      return phoneNumber;
   };

   async function updateMessageOnDatabase(messageId, messageStatus) { // ===============================================

      console.log('MODIFICANDO: ' + messageId);

      // _______________________________________________________________________
      const db = remote.getGlobal('database');
      const collection = await db.collection(database_message_collection);

      // -----------------------------------------------------------------------
      const today_tmp = new Date();
      const hour = today_tmp.getHours() < 10 ? '0' + today_tmp.getHours() : today_tmp.getHours();
      const minute = today_tmp.getMinutes() < 10 ? '0' + today_tmp.getMinutes() : today_tmp.getMinutes();
      const time = hour + ':' + minute;

      // -----------------------------------------------------------------------
      const sendComputer = storedData.get('computer_data');
      sendComputer.validation_key = storedData.get('key_settings').validation_key;
      sendComputer.market_name = storedData.get('market_settings.market_name');
      sendComputer.send_date_time = storedData.get('tmp_data').current_date + ' - ' + time;

      // -----------------------------------------------------------------------
      await collection.updateOne({message_id: messageId}, {'$set': {'message_status': messageStatus, 'sent_from': sendComputer}});
   }

   function getErrorTableCustomerFields(customer) { // =================================================================

      const shortOrderNumber = customer.order_number.substr(customer.order_number.length - 4);
      const orderDateTime = `${customer.order_date.substr(0, 5)} - ${customer.order_time}`;
      const firstName = customer.order_detailed_info.customer_first_name;
      const phoneNumber = customer.customer_phone;
      const messageType = customer.message_type;
      const messageContent = customer.generatedMessage;

      return [shortOrderNumber, orderDateTime, firstName, phoneNumber, messageType, messageContent];
   }

   function getSentTableCustomerFields(customer) { // ==================================================================
      // PEDIDO HORA MENSAGEM NUMERO

      const shortOrderNumber = customer.order_number.substr(customer.order_number.length - 4);
      const orderDateTime = `${customer.order_date.substr(0, 5)} - ${customer.order_time}`;
      const firstName = customer.order_detailed_info.customer_first_name;
      const phoneNumber = customer.customer_phone;
      const messageType = customer.message_type;

      return [shortOrderNumber, orderDateTime, firstName, phoneNumber, messageType];
   }

// ####################################################################################################################################
