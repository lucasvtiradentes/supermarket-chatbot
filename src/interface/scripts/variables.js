// ####################################################################################################################################

   const { ipcRenderer, remote} = require('electron');
   const Store = require('electron-store');
   const { join } = require('path');
   const app = remote.app;

// ####################################################################################################################################
   const webview = document.querySelector('#myweb');
   const storedData = new Store();

// ####################################################################################################################################

   const el_errorMessagesTable = document.getElementById('errorMessagesTable');
   const el_lastMessagesTable = document.getElementById('lastSentMessagestable');

   const el_totalMessgesChartTitle = document.getElementById('totalMessagesChartTitle');
   const el_totalMessgesChart = document.getElementById('totalMessagesChart').getContext('2d');

   const el_sentMessgesChartTitle = document.getElementById('sentMessagesChartTitle');
   const el_sentMessgesChart = document.getElementById('sentMessagesChart').getContext('2d');

// ####################################################################################################################################
   const el_marketName = document.getElementById('marketName');
   const el_chatbotKey = document.getElementById('chatbotKey');
   const el_marketClosingTime = document.getElementById('marketClosingTime');
   const el_marketSameDayDeliveryTime = document.getElementById('marketSameDayDeliveryTime');

// ####################################################################################################################################
   const el_analysedDate = document.getElementById('analysedDate');
   const el_messagesDestination = document.getElementById('messagesDestination');
   const el_testCellPhone = document.getElementById('testCellPhone');

// ####################################################################################################################################
   const el_activateChatbot = document.getElementById('activateChatbot');
   const el_chartsData = document.getElementById('chartsData');
   const el_searchForUpdates = document.getElementById('searchForUpdates');

// ####################################################################################################################################
   remote.getCurrentWebContents().on('dom-ready', function() {
      ipcRenderer.send('main_loaded-window', 'interface');
   });

   webview.addEventListener('dom-ready', function() {
      ipcRenderer.send('main_loaded-window', 'web-view');
      // webview.openDevTools();
   });

// ####################################################################################################################################