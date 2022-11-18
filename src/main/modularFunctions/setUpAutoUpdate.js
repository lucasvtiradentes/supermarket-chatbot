// ####################################################################################################################################

   const { autoUpdater } = require('electron-updater');

// ####################################################################################################################################

   module.exports = setUpAutoUpdate;

// ####################################################################################################################################

   function setUpAutoUpdate(showMessage) { // ==========================================================================

      autoUpdater.autoDownload = true;
      autoUpdater.allowDowngrade = false;

      autoUpdater.checkForUpdatesAndNotify();

      autoUpdater.on('checking-for-update', () => {
         // interfaceWindow.webContents.send('interface-show_gui_message', {title: "Informações sobre atualização", message: "Procurando por atualizações", description: ""});
         console.log('Checking for updates');
      });

      autoUpdater.on('update-available', (info) => {
         console.log('Update available: ' + info);
         interfaceWindow.webContents.send('interface-show_gui_message', {title: 'Resultado da busca por atualizações', message: 'Atualização encontrada', description: ''});
      });

      autoUpdater.on('update-not-available', (info) => {
         console.log('Update not available: ' + info);

         if (showMessage === true) {
            interfaceWindow.webContents.send('interface-show_gui_message', {title: 'Resultado da busca por atualizações', message: 'Não há atualizações', description: ''});
         }
      });

      autoUpdater.on('download-progress', (progressObj) => {
         let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
         log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
         log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';

         console.log(log_message);
         interfaceWindow.setProgressBar(Number(progressObj.transferred / progressObj.total));
      });

      autoUpdater.on('update-downloaded', (info) => {
         console.log('update-downloaded: ' + info);

         if (showMessage === true) {
            interfaceWindow.webContents.send('interface-show_gui_message', {title: 'Informações sobre atualização', message: 'Atualização baixada. Reinicie a aplicação para atualizar!', description: ''});
         }

      });

      autoUpdater.on('error', (err) => {
         if (err) {
            console.log('erro: ' + err);
         }

         if (showMessage === true) {
            interfaceWindow.webContents.send('interface-show_gui_message', {title: 'Informações sobre atualização', message: 'Erro ao atualizar', description: err});
         }

      });

   }


// ####################################################################################################################################
