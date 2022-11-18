// ####################################################################################################################################
   const showGuiMessage = require('../listenEventsFunctions/showGuiMessage.js');
   const {remote} = require('electron');
   const database_validation_keys_collection = process.env.DATABASE_KEYS_COLLECTION_NAME;

// ####################################################################################################################################

   module.exports = verifyNewChatbotKey;

// ####################################################################################################################################

   async function verifyNewChatbotKey(validationKey) { // ===========================================================================


      // -----------------------------------------------------------------------
      console.log('key to check: ' + validationKey);

      canInitChatbot('disable');

      // _______________________________________________________________________
      const db = remote.getGlobal('database');
      const collection = await db.collection(database_validation_keys_collection);
      const dbKeysArr = await collection.find({keyId: validationKey}).toArray();
      // _______________________________________________________________________

      if (dbKeysArr.length === 0) {
         updateLocalStorageKeyInfo('', []);
         console.log(`key ${validationKey} was not found`);
         canInitChatbot('enable');
      } else {

         const marketsAllowdByKey = dbKeysArr[0].markets;
         updateLocalStorageKeyInfo(validationKey, marketsAllowdByKey);

         await saveComputerToKey(collection, dbKeysArr, validationKey);

         console.log(`key ${validationKey} was found!`);
         showGuiMessage(null, {title: 'Chave configurada!', message: 'Identificação da chave: ' + '\n' + dbKeysArr[0].keyName, description: ''});
         canInitChatbot('enable');
      }

   }

   function updateLocalStorageKeyInfo(validationKey, markets) { // =====================================================

      storedData.set('key_settings.validation_key', validationKey);
      storedData.set('key_settings.validation_date', storedData.get('tmp_data').current_date);
      storedData.set('key_settings.allowed_markets', markets);

   }

   async function saveComputerToKey(collection, dbKeysArr, validationKey) { // =========================================

      // -----------------------------------------------------------------------
      const keyComputers = dbKeysArr[0] ? dbKeysArr[0].computers : [];
      let currentComputer = storedData.get('computer_data');
      currentComputer.validation_date = storedData.get('tmp_data').current_date;
      let computerFound = false;

      if (keyComputers.length > 0) {
         // VERIFY IF COMPUTER EXISTS

         for (let x = 0; x < keyComputers.length; x++) {
            const computer = keyComputers[x];

            if (computer.computer_name === currentComputer.computer_name && computer.username === currentComputer.username) {
               computerFound = true;
               break;
            }
         }

      }

      // -----------------------------------------------------------------------
      if (keyComputers.length > 0 && computerFound === false) {
         // IF THERE ARE COMPUTERS, BUT CURRENT COMPUTER WAS NOT FOUND

         let allComputers = keyComputers;
         allComputers.push(currentComputer);
         await collection.updateOne({keyId: validationKey}, {'$set': {computers: allComputers}});
         console.log(`another computer was add to ${validationKey}`);

      } else if (keyComputers.length === 0 && computerFound === false) {
         // IF THERE AREN'T COMPUTERS

         await collection.updateOne({keyId: validationKey}, {'$set': {computers: [currentComputer]}});
         console.log(`first computer added to ${validationKey}`);

      } else {
         console.log('computer already added');
      }

   }

// ####################################################################################################################################
