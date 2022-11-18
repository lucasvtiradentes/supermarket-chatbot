// ####################################################################################################################################
   const {globalShortcut, app} = require('electron');
   const Store = require('electron-store');
   const storedData = new Store();

// ####################################################################################################################################
   module.exports = setUpKeyBindings;

// ####################################################################################################################################

   function setUpKeyBindings(window) { // =====================================================================================

      const win_contents = window.webContents;

      // -----------------------------------------------------------------------
      globalShortcut.register('CommandOrControl+1', () => {
         win_contents.executeJavaScript('document.getElementsByClassName(\'two\')[0].click()');
      });

      globalShortcut.register('CommandOrControl+2', () => {
         win_contents.executeJavaScript('document.getElementsByClassName(\'three\')[0].click()');
      });

      globalShortcut.register('CommandOrControl+3', () => {
         win_contents.executeJavaScript('document.getElementsByClassName(\'four\')[0].click()');
      });

      globalShortcut.register('CommandOrControl+4', () => {
         win_contents.executeJavaScript('document.getElementsByClassName(\'five\')[0].click()');
      });

      // SET keyBindings -------------------------------------------------------
      globalShortcut.register('CommandOrControl+h', () => {
         win_contents.executeJavaScript('document.getElementsByClassName(\'one\')[0].click()');
      });

      globalShortcut.register('CommandOrControl+r', () => {
         app.relaunch();
         app.exit(0);
      });

      globalShortcut.register('CommandOrControl+u', () => {
         require('./setUpAutoUpdate')(true);
      });

      globalShortcut.register('CommandOrControl+g', () => {
         win_contents.send('interface-switch_charts_data');
      });

      globalShortcut.register('CommandOrControl+space', () => {
         win_contents.executeJavaScript('document.getElementById(\'activateChatbot\').click()');
      });

      globalShortcut.register('CommandOrControl+f4', () => {
         app.exit(0);
      });

   }

// ####################################################################################################################################