// ####################################################################################################################################

   ipcRenderer.on('interface-show_message', require('./scripts/listenEventsFunctions/showConsoleMessage.js'));

   ipcRenderer.on('interface-send_message_to_customers', require('./scripts/listenEventsFunctions/sendCustomerMessage.js'));

   ipcRenderer.on('interface-show_gui_message', require('./scripts/listenEventsFunctions/showGuiMessage.js'));

   ipcRenderer.on('interface-go_to_tab', require('./scripts/listenEventsFunctions/goToTab.js'));

   ipcRenderer.on('interface-change_bot_color', require('./scripts/listenEventsFunctions/changeBotColor.js'));

   ipcRenderer.on('interface-switch_charts_data', require('./scripts/listenEventsFunctions/switchChatsData.js'));

// ####################################################################################################################################