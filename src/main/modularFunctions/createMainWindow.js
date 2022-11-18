// ####################################################################################################################################
   const { join } = require('path');
   const { BrowserWindow, app } = require('electron');
   const {app_title, app_width, app_height} = require('../../configs.json');

// ####################################################################################################################################
   module.exports = createMainWindow;

// ####################################################################################################################################

   function createMainWindow() { // ===============================================================================

      // -----------------------------------------------------------------------
      const app_interface = join(__dirname, '../../../src/interface/index.html');
      const app_icon = join(__dirname, '../../../src/interface/images/Icon.png');

      const windowOptions = {
         width          : app_width,
         height         : app_height,
         title          : `${app_title}`,
         webPreferences : {
            nodeIntegration    : true,
            webviewTag         : true,
            enableRemoteModule : true
            // partition: "persist:session_name",
         },
         icon: app_icon
      };

      const pageOptions = {
         userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'
      };

      // -----------------------------------------------------------------------
      const window = new BrowserWindow(windowOptions);
      window.setMenu(null);
      window.loadURL('file://' + app_interface, pageOptions);

      // -----------------------------------------------------------------------
      window.on('close', function() {
         app.quit();
      });

      // -----------------------------------------------------------------------
      return window;
   }


// ####################################################################################################################################