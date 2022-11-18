// ####################################################################################################################################
   const { Chart } = require('chart.js');

// ####################################################################################################################################

   module.exports = updateCharts;

// ####################################################################################################################################

   function updateCharts() {
      updateTotalMessagesChart();
      updateSentMessagesChart();
   }

// ####################################################################################################################################

   const sentChartOptions = {
      events   : false,
      tooltips : {
         enabled: false
      },
      hover: {
         animationDuration: 0
      },
      animation: {
         duration   : 1,
         onComplete : function() {
            var chartInstance = this.chart,
               ctx = chartInstance.ctx;
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';

            this.data.datasets.forEach(function(dataset, i) {
               var meta = chartInstance.controller.getDatasetMeta(i);
               meta.data.forEach(function(bar, index) {
                  var data = dataset.data[index];
                  ctx.fillText(data, bar._model.x, bar._model.y - 5);
               });
            });
         }
      },
      legend: {
         labels: {
            fontSize: 0
         }
      },
      scales: {
         yAxes: [{
            display : false,
            ticks   : {
               beginAtZero: true }
         }],
         xAxes: [{
            gridLines: {
               show      : false,
               lineWidth : 0
            }
         }]
      }
   };

   const sentChartData = (chartValues, chartLegends, colors) => (
      {
         labels   : chartLegends,
         datasets : [{
            label           : 'Quantidade de mensagens',
            backgroundColor : 'rgb(0,0,205)',
            borderColor     : 'rgb(0,0,205)',
            data            : chartValues,
            barPercentage   : 0.75,
            backgroundColor : colors
         }]
      }
   );

   function updateSentMessagesChart() { // ========================================================================

      const charts_data = storedData.get('app_settings').charts_data;
      let dataArr;
      let chartBaseTitle;

      if (charts_data === 'Hoje') {
         dataArr = getMessagesCategoryArr(storedData.get('message_stats_data').today_sent_messages);
         chartBaseTitle = 'Mensagens enviadas hoje';
      } else if (charts_data === 'Todos os dias') {
         dataArr = getMessagesCategoryArr(storedData.get('message_stats_data').total_sent_messages);
         chartBaseTitle = 'Mensagens enviadas';
      }

      const totalMessges = dataArr[0] + dataArr[1] + dataArr[2];
      el_sentMessgesChartTitle.innerText = `${chartBaseTitle} (${totalMessges})`;

      const chart = new Chart(el_sentMessgesChart, {
         type    : 'bar',
         data    : sentChartData(dataArr, ['Saudação', 'Ocorrências', 'Retirada'], ['green', 'green', 'green']),
         options : sentChartOptions
      });
   }

// ####################################################################################################################################

   const totalChartOptions = {
      events   : false,
      tooltips : {
         enabled: false
      },
      hover: {
         animationDuration: 0
      },
      animation: {
         duration   : 1,
         onComplete : function() {
            var chartInstance = this.chart,
               ctx = chartInstance.ctx;
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';

            this.data.datasets.forEach(function(dataset, i) {
               var meta = chartInstance.controller.getDatasetMeta(i);
               meta.data.forEach(function(bar, index) {
                  var data = dataset.data[index];
                  ctx.fillText(data, bar._model.x, bar._model.y - 5);
               });
            });
         }
      },
      legend: {
         labels: {
            fontSize: 0
         }
      },
      scales: {
         yAxes: [{
            display : false,
            ticks   : {
               beginAtZero: true
            }
         }],
         xAxes: [{
            gridLines: {
               show      : false,
               lineWidth : 0
            }
         }]
      }
   };

   const totalChartData = (chartValues, chartLegends, colors) => (
      {
         labels   : chartLegends,
         datasets : [{
            label           : 'Quantidade de mensagens',
            backgroundColor : 'rgb(0,0,205)',
            borderColor     : 'rgb(0,0,205)',
            data            : chartValues,
            barPercentage   : 0.75,
            backgroundColor : colors
         }]
      }
   );

   function updateTotalMessagesChart() { // ============================================================================

      const charts_data = storedData.get('app_settings').charts_data;
      const dataArr = getTotalMessagesArr(charts_data);
      let chartBaseTitle;

      const totalMessges = dataArr[0] + dataArr[1] + dataArr[2];

      if (charts_data === 'Hoje') {
         chartBaseTitle = 'Mensagens totais hoje';
      } else {
         chartBaseTitle = 'Mensagens totais';
      }

      el_totalMessgesChartTitle.innerText = `${chartBaseTitle} (${totalMessges})`;

      const chart = new Chart(el_totalMessgesChart, {
         type    : 'bar',
         data    : totalChartData(dataArr, ['Pendentes', 'Erro', 'Enviadas'], ['blue', 'red', 'green']),
         options : totalChartOptions
      });

   }

// ####################################################################################################################################

   function getTotalMessagesArr(charts_data) { // ======================================================================

      const pendingMessages = storedData.get('message_stats_data').pending_messages;
      let sentMessages;
      let errorMessages;

      if (charts_data === 'Hoje') {
         sentMessages = getMessagesCategoryArr(storedData.get('message_stats_data').today_sent_messages);
         errorMessages = getTodayErrorMessagesArr(storedData.get('message_stats_data').error_messages);
      } else if (charts_data === 'Todos os dias') {
         sentMessages = getMessagesCategoryArr(storedData.get('message_stats_data').total_sent_messages);
         errorMessages = storedData.get('message_stats_data').error_messages;
      }

      errorMessages = errorMessages.length || 0;

      return [pendingMessages, errorMessages, countArrValue(sentMessages)];
   }

   function getMessagesCategoryArr(dataObj) { // =======================================================================

      const objTmp = dataObj;
      const greetingMessages = objTmp.greeting;
      const occurrenceMessages = objTmp.occurrences;
      const readyForPickupMessages = objTmp.ready_for_pickup;

      return [greetingMessages, occurrenceMessages, readyForPickupMessages];
   }

   function getTodayErrorMessagesArr(erroMessagesArr) { // =============================================================

      // 'order', 'order_date',  'cellPhone', 'name', 'market', 'attempt_to_send_message_date', 'messageTwype', 'messageContent'

      let sentAttempColumn = 5;
      let todayErrorMessages = new Array();

      for (let x = 0; x < erroMessagesArr.length; x++) {
         const message = erroMessagesArr[x];

         if (message[sentAttempColumn] === storedData.get('tmp_data').current_date) {
            todayErrorMessages.push(message);
         }
      }

      return todayErrorMessages;

   }

   function countArrValue(Arr) { // ====================================================================================

      let finalArr = 0;

      for (let x = 0; x < Arr.length; x++) {
         finalArr = finalArr + Arr[x];
      }

      return finalArr;
   };

// ####################################################################################################################################