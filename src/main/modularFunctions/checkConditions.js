// ####################################################################################################################################
   const http2 = require('http2');
   const Store = require('electron-store');
   const storedData = new Store();
   const setUpDatabase = require('./setUpDatabase.js');

// ####################################################################################################################################

   module.exports = checkConditions;

// ####################################################################################################################################

   async function checkConditions(showMessage) {

      let error = false;

      // -----------------------------------------------------------------------
      const netWorkConnected = await checkConnection();

      storedData.set('tmp_data.is_network_connected', netWorkConnected);
      if (netWorkConnected === true) {
         interfaceWindow.webContents.executeJavaScript('document.getElementById(\'internetStatus\').setAttribute(\'style\', \'color: green\')');
         if (showMessage) {console.log('internet connected');}
      } else {
         interfaceWindow.webContents.executeJavaScript('document.getElementById(\'internetStatus\').setAttribute(\'style\', \'color: red\')');
         error = error ? error + '\n' + 'Sem acesso à internet' : 'Sem acesso à internet';
         if (showMessage) {console.log('internet not connected');}
      }

      // -----------------------------------------------------------------------
      database = database || await setUpDatabase();

      if (database === false) {
         storedData.set('tmp_data.is_database_connected', false);
         interfaceWindow.webContents.executeJavaScript('document.getElementById(\'databaseStatus\').setAttribute(\'style\', \'color: red\')');
         error = error ? error + '\n' + 'Banco de dados não conectado' : 'Banco de dados não conectado';
         if (showMessage) {console.log('database not connected');}
      } else {
         storedData.set('tmp_data.is_database_connected', true);
         interfaceWindow.webContents.executeJavaScript('document.getElementById(\'databaseStatus\').setAttribute(\'style\', \'color: green\')');
         if (showMessage) {console.log('database connected');}
      }

      // -----------------------------------------------------------------------
      const isSettingsCorrect = await checkSettings();
      if (isSettingsCorrect === true) {
         storedData.set('tmp_data.is_settings_correct', true);
         interfaceWindow.webContents.executeJavaScript('document.getElementById(\'settingsStatus\').setAttribute(\'style\', \'color: green\')');
         if (showMessage) {console.log('settings are correct');}
      } else {
         storedData.set('tmp_data.is_settings_correct', false);
         interfaceWindow.webContents.executeJavaScript('document.getElementById(\'settingsStatus\').setAttribute(\'style\', \'color: red\')');
         error = error ? error + '\n' + isSettingsCorrect : isSettingsCorrect;
         if (showMessage) {console.log('settings are not correct');}
      }

      if (error === false) {
         return true;
      } else {
         return error;
      }
   }

// ####################################################################################################################################

   function checkSettings() { // ===========================================================================

      const storedData = new Store();

      // KEY SETTINGS ----------------------------------------------------------
      const chatbotKey = storedData.get('key_settings').validation_key;
      const searchMarkets = storedData.get('key_settings').allowed_markets;

      if (!chatbotKey) {
         return 'Chave do mercado não está definida!';
      }

      if (!searchMarkets) {
         return 'Chave do mercado inválida!';
      }

      // MESSAGE SETTINGS ------------------------------------------------------
      const analysedDate = storedData.get('message_settings').analysed_period;
      const messagesDestination = storedData.get('message_settings').message_destination;
      const testCellPhone = storedData.get('message_settings').test_phone_number;

      if (messagesDestination === 'Número de testes' && testCellPhone === '') {
         return 'Número de testes não fornecido!';
      }

      if (!analysedDate) {
         return 'Dia analisado não está definido!';
      }

      // MARKET SETTINGS -------------------------------------------------------
      const marketName = storedData.get('market_settings').market_name;
      const marketClosingTime = storedData.get('market_settings').market_closing_time;
      const marketSameDayDeliveryTime = storedData.get('market_settings').market_same_day_delivery_time;

      if (!marketName) {
         return 'Nome do mercado não definido!';
      }

      if (!marketClosingTime) {
         return 'Hora de fechamento do mercado não definida!';
      }

      if (!marketSameDayDeliveryTime) {
         return 'Hora limite de entregas no mesmo dia do mercado não definida!';
      }

      // -----------------------------------------------------------------------
      return true;
   }

   function checkConnection() { // =====================================================================================
      return new Promise((resolve) => {
         const client = http2.connect('https://www.google.com');
         client.on('connect', () => {
            resolve(true);
            client.destroy();
         });
         client.on('error', () => {
            resolve(false);
            client.destroy();
         });
      });
   };

// ####################################################################################################################################
