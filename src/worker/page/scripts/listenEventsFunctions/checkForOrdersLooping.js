// ####################################################################################################################################
   const {remote, ipcRenderer} = require('electron');
   const interfaceWindow = remote.getGlobal('interfaceWindow');
   const Store = require('electron-store');
   const storedData = new Store();
   const stopCheckForMessagesLooping = require('../../../modularFunctions/stopLooping.js');
   const database_message_collection = process.env.DATABASE_MESSAGE_COLLECTION_NAME;

// ####################################################################################################################################
   module.exports = checkForOrdersLooping;

// ####################################################################################################################################

   async function checkForOrdersLooping(event, arg) {

      // _______________________________________________________________________
      const disableChecking = Boolean(remote.getGlobal('sharedProperties').lookingForMessages);

      if (disableChecking === false) {
         stopCheckForMessagesLooping();
         return;
      }

      // _______________________________________________________________________
      console.log('CHECANDO: ' + arg);

      // _______________________________________________________________________
      const db = remote.getGlobal('database');
      const collection = await db.collection(database_message_collection);

      // _______________________________________________________________________
      let message_search_query;

      message_search_query = {
         message_status: 'pending',
      };

      // _______________________________________________________________________
      let searchedMarkets = new Array();
      const markets = storedData.get('key_settings').allowed_markets;
      const arrMarkets = Object.values(markets);
      let isAdminKey = false;

      for (let x = 0; x < arrMarkets.length; x++) {

         if (arrMarkets[x].marketId.toString() === '*') {
            isAdminKey = true;
            break;
         }

         searchedMarkets.push({market_id: arrMarkets[x].marketId});
      }

      if (isAdminKey) {
         // DONT ADD MARKET QUERY
         console.log('key admin');
      } else {
         message_search_query = {
            ...message_search_query,
            $or: searchedMarkets
         };
         console.log('regular key market');
      }

      // _______________________________________________________________________
      const today_tmp = new Date();
      const today_day = Number(today_tmp.getDate()).toString().length === 2 ? Number(today_tmp.getDate()) : '0' + Number(today_tmp.getDate());
      const today_month = Number(today_tmp.getMonth() + 1).toString().length === 2 ? Number(today_tmp.getMonth() + 1) : '0' + Number(today_tmp.getMonth() + 1);
      const today_year = today_tmp.getFullYear();
      const today = `${today_day}/${today_month}/${today_year}`;

      const yesterday_tmp = new Date(new Date().setDate(new Date().getDate() - 1));
      const yesterday_day = Number(yesterday_tmp.getDate()).toString().length === 2 ? Number(yesterday_tmp.getDate()) : '0' + Number(yesterday_tmp.getDate());
      const yesterday_month = Number(yesterday_tmp.getMonth() + 1).toString().length === 2 ? Number(yesterday_tmp.getMonth() + 1) : '0' + Number(yesterday_tmp.getMonth() + 1);
      const yesterday_year = yesterday_tmp.getFullYear();
      const yesterday = `${yesterday_day}/${yesterday_month}/${yesterday_year}`;

      const analysedDate = storedData.get('message_settings').analysed_period.toString();

      if (analysedDate === 'Hoje') {

         message_search_query = {
            ...message_search_query,
            order_date: today
         };

      } else if (analysedDate === 'Ontem e hoje') {

         message_search_query = {
            ...message_search_query,
            $or: [
               {
                  order_date: today
               },
               {
                  order_date: yesterday
               }
            ]
         };

      } else if (analysedDate === 'Todos os dias') {

         // DONT ADD DATE QUERY
      }

      // _______________________________________________________________________
      const pendingMessages = await collection.find(message_search_query).toArray();

      // _______________________________________________________________________
      console.log(message_search_query);
      console.log(pendingMessages);

      // _______________________________________________________________________
      ipcRenderer.send('main_analyze-received-database-content', pendingMessages);
   }

// ####################################################################################################################################
