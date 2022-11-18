// ####################################################################################################################################

   const { existsSync } = require('fs');
   const { platform, hostname, userInfo } = require('os');
   const configsPath = join(app.getPath('userData'), './config.json');
   const configsExist = existsSync(configsPath);
   const goToSettings = require('./scripts/listenEventsFunctions/goToTab.js');
   const version = require('../../package.json').version;
   const {app_title} = require('../configs.json');

   // -----------------------------------------------------------------------
   if (!configsExist) {
      goToSettings(null, 'settings');
      storeDefaultConfigs();
   }

   // -----------------------------------------------------------------------
   loadSavedConfigs();

   // -----------------------------------------------------------------------
   storedData.set('app_settings.current_version', version);
   storedData.set('tmp_data.current_date', getCurrentDate());
   storedData.set('message_stats_data.pending_messages', 0);

   if (storedData.get('message_stats_data.last_sent_message_date') !== getCurrentDate()) {
      storedData.set('message_stats_data.today_sent_messages.greeting', 0);
      storedData.set('message_stats_data.today_sent_messages.occurrences', 0);
      storedData.set('message_stats_data.today_sent_messages.ready_for_pickup', 0);
   }
   document.getElementById('pageCenterText').innerText = `${app_title} V${version}`;

// ####################################################################################################################################

   function storeDefaultConfigs() { // =================================================================================

      storedData.set('tmp_data', {
         'current_date'          : '',
         'current_whatsapp_page' : '',
         'is_chatbot_active'     : '',
         'is_database_connected' : '',
         'is_network_connected'  : '',
         'is_settings_correct'   : ''
      });

      storedData.set('computer_data', {
         'system'            : platform(),
         'computer_name'     : hostname(),
         'username'          : userInfo().username,
         'registration_date' : getCurrentDate(),
      });

      storedData.set('key_settings', {
         'validation_key'  : '',
         'validation_date' : '',
         'allowed_markets' : []
      });

      storedData.set('market_settings', {
         'market_name'                   : '',
         'market_closing_time'           : '',
         'market_same_day_delivery_time' : ''
      });

      storedData.set('message_settings', {
         'analysed_period'     : '',
         'message_destination' : 'Número de testes',
         'test_phone_number'   : '',
      });

      storedData.set('app_settings', {
         'current_version'    : version,
         'charts_data'        : 'Hoje',
         'search_for_updates' : false,
      });

      storedData.set('message_stats_data', {
         'last_sent_message_date' : '',
         'pending_messages'       : 0,
         'total_sent_messages'    : {
            greeting         : 0,
            occurrences      : 0,
            ready_for_pickup : 0
         },
         'today_sent_messages': {
            greeting         : 0,
            occurrences      : 0,
            ready_for_pickup : 0
         },
         'last_sent_messages' : [],
         'error_messages'     : []
      });

   };

   function loadSavedConfigs() { // ====================================================================================

      const message_settings = storedData.get('message_settings');
      const app_settings = storedData.get('app_settings');
      const tmp_data = storedData.get('tmp_data');
      const key_settings = storedData.get('key_settings');
      const market_settings = storedData.get('market_settings');

      // -----------------------------------------------------------------------
      if (message_settings.analysed_period) {
         const el_analysedDateOptions = el_analysedDate.options;
         for (let x = 0; x < el_analysedDateOptions.length; x++) {
            if (message_settings.analysed_period === el_analysedDateOptions[x].text) {
               // console.log(el_analysedDateOptions[x].index + ' -> ' + el_analysedDateOptions[x].text);
               el_analysedDate.selectedIndex = el_analysedDateOptions[x].index;
            }
         }
      }

      if (message_settings.message_destination) {
         const el_messagesDestinationOptions = el_messagesDestination.options;
         for (let x = 0; x < el_messagesDestinationOptions.length; x++) {
            if (message_settings.message_destination === el_messagesDestinationOptions[x].text) {
               // console.log(el_messagesDestinationOptions[x].index + ' -> ' + el_messagesDestinationOptions[x].text);
               el_messagesDestination.selectedIndex = el_messagesDestinationOptions[x].index;
            }
         }
      }

      if (message_settings.test_phone_number) {
         el_testCellPhone.value = message_settings.test_phone_number;
      }

      // -----------------------------------------------------------------------
      if (market_settings.market_name) {
         el_marketName.value = market_settings.market_name;
      }

      if (market_settings.market_closing_time) {
         el_marketClosingTime.value = market_settings.market_closing_time;
      }

      if (market_settings.market_same_day_delivery_time) {
         el_marketSameDayDeliveryTime.value = market_settings.market_same_day_delivery_time;
      }

      // -----------------------------------------------------------------------
      if (key_settings.validation_key) {
         el_chatbotKey.value = key_settings.validation_key;
      }

      // -----------------------------------------------------------------------
      if (typeof tmp_data.is_chatbot_active !== undefined) {
         el_activateChatbot.checked = tmp_data.is_chatbot_active;
      }

      // -----------------------------------------------------------------------
      if (typeof app_settings.search_for_updates !== undefined) {
         el_searchForUpdates.checked = app_settings.search_for_updates;
      }

      if (app_settings.charts_data) {
         const el_chartsDataOptions = el_chartsData.options;
         for (let x = 0; x < el_chartsDataOptions.length; x++) {
            if (app_settings.charts_data === el_chartsDataOptions[x].text) {
               // console.log(el_chartsDataOptions[x].index + ' -> ' + el_chartsDataOptions[x].text);
               el_chartsData.selectedIndex = el_chartsDataOptions[x].index;
            }
         }
      }

   }

   function getCurrentDate() { // ======================================================================================

      const today_tmp = new Date();
      const day = today_tmp.getDate() < 10 ? '0' + today_tmp.getDate() : today_tmp.getDate();
      const month = (today_tmp.getMonth() + 1) < 10 ? '0' + (today_tmp.getMonth() + 1) : (today_tmp.getMonth() + 1) ;
      const today = day + '/' + month + '/' + today_tmp.getFullYear();

      return today;
   }

// ####################################################################################################################################