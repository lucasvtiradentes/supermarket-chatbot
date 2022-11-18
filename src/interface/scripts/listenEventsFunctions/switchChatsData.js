// ####################################################################################################################################
   const updateCharts = require('../modularFunctions/updateCharts.js');

   // ####################################################################################################################################

   module.exports = showConsoleMessage;

// ####################################################################################################################################

   function showConsoleMessage(event, arg) { //========================================================================

         const currentChartsData = storedData.get('app_settings.charts_data');

         if (currentChartsData === 'Hoje') {
            storedData.set('app_settings.charts_data', 'Todos os dias');
            document.getElementById('chartsData').selectedIndex = 2;
         } else if (currentChartsData === 'Todos os dias') {
            storedData.set('app_settings.charts_data', 'Hoje');
            document.getElementById('chartsData').selectedIndex = 1;
         }

         updateCharts();
   }

// ####################################################################################################################################