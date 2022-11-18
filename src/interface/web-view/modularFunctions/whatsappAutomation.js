// ####################################################################################################################################

   module.exports = {

      waitPageGetReady,

      waitLoadingPage,

      waitForEnterChatButton,
      clickEnterWhatsappButton,

      waitForSendButton,
      clickSendButton,

      getLastSentMessageStatus,
      getPageStatus

   };

   // ####################################################################################################################################

   async function waitPageGetReady() { // ==============================================================================

      let isPageReady = false;
      let checkedPageCount = 0;

      while (isPageReady === false) {
         checkedPageCount = checkedPageCount + 1;

         let isPageReadyTmp = document.readyState === 'complete' ? true : false;

         if (isPageReadyTmp === true) {
            isPageReady = true;
         } else {
            await new Promise(resolve => setTimeout(resolve, Number(2000)));
            isPageReady = false;
         }

         console.log(`Is Page Ready -> ${checkedPageCount} -> ${isPageReady} -> ${document.readyState}`);
         if (checkedPageCount === 20) {
            return false;
         }

      }

      await new Promise(resolve => setTimeout(resolve, Number(2000)));
      return true;

   }

// ####################################################################################################################################

   async function waitLoadingPage() { // ===============================================================================

      let IsLoadingPage = true;
      let checkedPageCount = 0;

      while (IsLoadingPage === true) {
         checkedPageCount = checkedPageCount + 1;

         let el_IdLoading = document.getElementById('startup');
         if (el_IdLoading) {
            IsLoadingPage = true;
            await new Promise(resolve => setTimeout(resolve, Number(2000)));
         } else {
            IsLoadingPage = false;
         }

         console.log(`Is Loading Page -> ${checkedPageCount} -> ${IsLoadingPage}`);
         if (checkedPageCount === 20) {
            return false;
         }

      }

      return true;

   }

// ####################################################################################################################################


   async function waitForEnterChatButton() { // ========================================================================

      let foundSendButton = false;
      let checkedPageCount = 0;

      while (foundSendButton === false) {
         checkedPageCount = checkedPageCount + 1;

         let el_button = document.getElementById('action-button');
         if (el_button) {
            foundSendButton = true;
         } else {
            foundSendButton = false;
            await new Promise(resolve => setTimeout(resolve, Number(2000)));
         }

         console.log(`Enter Chat button -> ${checkedPageCount} -> ${foundSendButton}`);

      }

      return true;

   }

   function clickEnterWhatsappButton() { // ============================================================================
      document.getElementById('action-button').click();
   }

// ####################################################################################################################################

   async function waitForSendButton() { // =============================================================================

      let foundSendButton = false;
      let checkedPageCount = 0;

      while (foundSendButton === false) {
         checkedPageCount = checkedPageCount + 1;

         let el_button = document.getElementsByClassName('_1U1xa')[0];
         if (el_button) {
            foundSendButton = true;
         } else {
            foundSendButton = false;
            await new Promise(resolve => setTimeout(resolve, Number(2000)));
         }

         console.log(`Send button -> ${checkedPageCount} -> ${foundSendButton}`);

      }

      return true;

   }


   function clickSendButton() { // =====================================================================================
      document.getElementsByClassName('_1U1xa')[0].click();
   }

// ####################################################################################################################################
   async function getLastSentMessageStatus(messageCompareContent) { // =================================================

      // -----------------------------------------------------------------------
      const Store = require('electron-store');
      const storedData = new Store();

      // -----------------------------------------------------------------------
      let el_TodasMinhasMensagens = document.querySelectorAll('#main div.message-out');
      let el_UltimaMensagem = el_TodasMinhasMensagens[el_TodasMinhasMensagens.length - 1];
      let lastMessageStatus;

      if (el_UltimaMensagem) {

         let lastSentMessageContent;
         lastSentMessageContent = el_UltimaMensagem.querySelector('span.selectable-text > span');
         lastSentMessageContent = lastSentMessageContent.innerText.replace(/[\W_]+/g, ''); // /[^a-zA-Z0-9]+/g
         lastSentMessageContent = lastSentMessageContent.substr(0, 200);

         if (lastSentMessageContent !== messageCompareContent) {

            lastMessageStatus = 'not the same message';

         } else {

            const el_span = el_UltimaMensagem.querySelector('div[class="_1qPwk"] > span');
            const messageStatus = el_span.getAttribute('data-icon');
            if (messageStatus === 'msg-time') {
               lastMessageStatus = 'pending';
            } else if (messageStatus === 'msg-check' || messageStatus === 'msg-dblcheck') {
               lastMessageStatus = 'sent';
            }

         }

      }

      storedData.set('tmp_data.last_sent_message_status', lastMessageStatus);
      console.log('Mensagem foi: ' + lastMessageStatus);

      return lastMessageStatus;
   }

// ####################################################################################################################################
   async function getPageStatus() { // =================================================================================

      // -----------------------------------------------------------------------
      const Store = require('electron-store');
      const storedData = new Store();

      // -----------------------------------------------------------------------
      const isWhatsappQrCodeScanScreen = () => {

         let el_qrCode = document.querySelector('canvas[aria-label="Scan me!"]');

         if (el_qrCode) {
            return true;
         } else {
            return false;
         }

      };

      // -----------------------------------------------------------------------
      const isTryToReconnectScreen = () => {

         let el_reconnect = document.querySelector('div[class="G_MLO"][data-animate-modal-popup="true"]');

         if (el_reconnect) {
            return true;
         } else {
            return false;
         }

      };

      // -----------------------------------------------------------------------
      const isLoadingScreen = () => {

         let el_loading = document.getElementById('startup');

         if (el_loading) {
            return true;
         } else {
            return false;
         }

      };

      const isLogedInPage = () => {

         let el_loading = document.querySelector('img[class="_2goTk _1Jdop _3Whw5"'); // IMAGEM DO PERFIL

         if (el_loading) {
            return true;
         } else {
            return false;
         }

      };

      const isTemporaryDesconnected = () => {

         let el_loading = document.querySelector('span[data-icon="alert-phone"]'); // IMAGEM DE TELEFONE DESCONECTADO

         if (el_loading) {
            return true;
         } else {
            return false;
         }

      };

      const isUsedInAnotherWindow = () => {

         let el_anotherWindow = document.querySelector('div[class="S7_rT FV2Qy"]'); // IMAGEM DE TELEFONE DESCONECTADO

         if (el_anotherWindow) {
            return true;
         } else {
            return false;
         }

      };

      const isInvalidPhoneNumber = () => {

         let el_ainvalidNumber = document.querySelector('div[class="_9a59P"]'); // POPUP DE NÚMERO INVÁLIDO

         if (el_ainvalidNumber) {
            return true;
         } else {
            return false;
         }

      };

      let currentPage;

      if (isLogedInPage()) {currentPage = 'Logado';}

      if (isLoadingScreen()) {currentPage = 'Carregando whatsapp';}
      if (isTemporaryDesconnected()) {currentPage = 'Telefone desconectado';}

      if (isUsedInAnotherWindow()) {currentPage = 'Sendo usado em outra janela';}
      if (isTryToReconnectScreen()) {currentPage = 'Tentando conectar';} // DEVE VIR DEPOIS DE LOGADO
      if (isWhatsappQrCodeScanScreen()) {currentPage = 'Escanear qr code';}

      if (isInvalidPhoneNumber()) {currentPage = 'Número inválido';}

      storedData.set('tmp_data.current_whatsapp_page', currentPage);
      console.log('salvei: ' + currentPage);

      return currentPage;
   }

// ####################################################################################################################################