// ####################################################################################################################################
   const Store = require('electron-store');
   const storedData = new Store();

// ####################################################################################################################################

   module.exports = allLoaded;

// ####################################################################################################################################
   async function allLoaded() {

      // -----------------------------------------------------------------------
      console.log(' ');
      console.log('#### EXECUTE WHEN ALL WINDOWS ARE LOADED ##################################################' + '\n');

      require('./setUpKeyBindings.js')(interfaceWindow);

      const conditionsSatisfied = await require('./checkConditions.js')(true);

      if (Boolean(storedData.get('app_settings').search_for_updates) === true && conditionsSatisfied === true) {
         require('../../main/modularFunctions/setUpAutoUpdate.js')();
      }

      console.log(' ');
      console.log('###########################################################################################' + '\n');

   }

// ####################################################################################################################################