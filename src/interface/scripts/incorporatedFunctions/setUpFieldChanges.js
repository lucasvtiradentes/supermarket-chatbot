// ####################################################################################################################################

   const checkValidationKey = require('./scripts/modularFunctions/checkValidationKey.js');

// MESSAGE SETTINGS ###################################################################################################################
   el_analysedDate.addEventListener('change', () => {
      const selectedItem = el_analysedDate.options[el_analysedDate.selectedIndex].text;
      const messageSettingsObj = storedData.get('message_settings');
      messageSettingsObj.analysed_period = selectedItem;
      storedData.set('message_settings', messageSettingsObj);
   });

   el_messagesDestination.addEventListener('change', () => {
      const selectedItem = el_messagesDestination.options[el_messagesDestination.selectedIndex].text;
      const messageSettingsObj = storedData.get('message_settings');
      messageSettingsObj.message_destination = selectedItem;
      storedData.set('message_settings', messageSettingsObj);
   });

   el_testCellPhone.addEventListener('change', () => {
      const messageSettingsObj = storedData.get('message_settings');
      messageSettingsObj.test_phone_number = el_testCellPhone.value;
      storedData.set('message_settings', messageSettingsObj);
   });

// MARKET SETTINGS ####################################################################################################################

   el_marketName.addEventListener('change', () => {
      storedData.set('market_settings.market_name', el_marketName.value);
   });

   el_marketClosingTime.addEventListener('change', () => {
      storedData.set('market_settings.market_closing_time', el_marketClosingTime.value);
   });

   el_marketSameDayDeliveryTime.addEventListener('change', () => {
      storedData.set('market_settings.market_same_day_delivery_time', el_marketSameDayDeliveryTime.value);
   });

// APP SETTINGS #######################################################################################################################

   el_searchForUpdates.addEventListener('change', () => {
      const appSettingsObj = storedData.get('app_settings');
      appSettingsObj.search_for_updates = el_searchForUpdates.checked;
      storedData.set('app_settings', appSettingsObj);
   });

   el_activateChatbot.addEventListener('change', () => {

      if (!el_activateChatbot.hasAttribute('disabled')) {
         // RUN ONLY WHEN ITS NOT DISABLED

         const tmpDataObj = storedData.get('tmp_data');
         tmpDataObj.is_chatbot_active = el_activateChatbot.checked;
         storedData.set('tmp_data', tmpDataObj);

         whenChatCheckBoxChange();
      }

   });

   el_chartsData.addEventListener('change', () => {
      const selectedItem = el_chartsData.options[el_chartsData.selectedIndex].text;
      const appSettingsObj = storedData.get('app_settings');
      appSettingsObj.charts_data = selectedItem;
      storedData.set('app_settings', appSettingsObj);

      updateCharts();
   });

// KEY SETTINGS #######################################################################################################################
   el_chatbotKey.addEventListener('change', async() => {

      const key = el_chatbotKey.value;
      const keySettingsObj = storedData.get('key_settings');
      keySettingsObj.validation_key = key === '' ? '' : key;
      keySettingsObj.validation_date = key === '' ? '' : storedData.get('tmp_data').current_date;
      keySettingsObj.allowed_markets = key === '' ? '' : keySettingsObj.allowed_markets;
      storedData.set('key_settings', keySettingsObj);

      if (key !== '') {
         await checkValidationKey(key);
      }

   });

// ####################################################################################################################################