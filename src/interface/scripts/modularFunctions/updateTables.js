// ####################################################################################################################################
   const Store = require('electron-store');
   const storedData = new Store();
   const showGuiMessage = require('../listenEventsFunctions/showGuiMessage.js');

// ####################################################################################################################################
   module.exports = updateTables;

// ####################################################################################################################################

   function updateTables() { // ========================================================================================
      updateLastSentMessagesTable();
      updateErrorMessagesTable();
   }

   function updateLastSentMessagesTable() { // =========================================================================

      const arrSent = storedData.get('message_stats_data.last_sent_messages');
      let newArrSent = new Array();

      for (let x = 0; x < arrSent.length; x++) {
         if (x > 9) {break;}
         newArrSent.push(arrSent[x]);
      }

      storedData.set('message_stats_data.last_sent_messages', newArrSent);

      const dataTMP = [
         ['Pedido', 'Hora pedido', 'Nome', 'Número', 'Mensagem' ],
         ...newArrSent
      ];

      el_lastMessagesTable.innerHTML = arrayToTable(dataTMP);

   }

   function updateErrorMessagesTable() { // ============================================================================

      const arrError = storedData.get('message_stats_data.error_messages');
      let newArrError = new Array();

      for (let x = 0; x < arrError.length; x++) {
         if (x > 9) {break;}
         const shownElements = [arrError[x][0], arrError[x][1], arrError[x][2], arrError[x][3], arrError[x][4]];
         newArrError.push(shownElements);
      }

      const dataTMP = [
         ['Pedido', 'Hora pedido', 'Nome', 'Número', 'Mensagem', 'Opções'],
         ...newArrError
      ];

      el_errorMessagesTable.innerHTML = arrayToTable(dataTMP, 'erroTable');

      const tbl = document.getElementById('erroTable');
      const tableRowCount = tbl.rows.length;

      if (tableRowCount > 1) {
         for (i = 1; i < tableRowCount; i++) {
            let cell = tbl.rows[i].insertCell(tbl.rows[i].cells.length);

            let divContainer = document.createElement('div');
            divContainer.classList.add('table-row-options');

            // -----------------------------------------------------------------
            const deleteMessageFunction = (originalArr, lineToRemove) => {
               return function() {

                  let arrAfterDelete = new Array();
                  for (let x = 0; x < originalArr.length; x++) {
                     if (x !== lineToRemove) {
                        arrAfterDelete.push(originalArr[x]);
                     }
                  }
                  storedData.set('message_stats_data.error_messages', arrAfterDelete);
                  updateTables();
               };
            };

            let removeIcon = document.createElement('i');
            removeIcon.classList.add('fas');
            removeIcon.classList.add('fa-trash-alt');
            removeIcon.classList.add('action-icon');
            removeIcon.onclick = deleteMessageFunction(arrError, i - 1);

            // -----------------------------------------------------------------
            const showMessageFunction = (messageContent) => {
               return function() {
                  showGuiMessage(null, {title: 'Conteúdo da mensagem gerada', message: messageContent, descripton: ''});
               };
            };

            let showMessage = document.createElement('i');
            showMessage.classList.add('fas');
            showMessage.classList.add('fa-inbox');
            showMessage.classList.add('action-icon');
            showMessage.onclick = showMessageFunction(arrError[i - 1][5]);

            // -----------------------------------------------------------------
            divContainer.appendChild(removeIcon);
            divContainer.appendChild(showMessage);
            cell.appendChild(divContainer);


            // -----------------------------------------------------------------


         }
      }

      if (arrError.length > 0) {
         document.getElementById('errorMessages').innerText = arrError.length;
      } else {
         document.getElementById('errorMessages').innerText = '';
      }
   }

// ####################################################################################################################################

   function arrayToTable(data, elId) { // ====================================================================================
      const [headings, ...rows] = data;
      return `
         <table id="${elId}" class="table-orders">
            <thead>${getCells(headings, 'th')}</thead>
            <tbody>${createBody(rows)}</tbody>
         </table>
      `;
   }

   function createBody(data) { // ======================================================================================
      return data.map(row => `<tr>${getCells(row, 'td')}</tr>`).join('');
   }

   function getCells(data, type) { // ==================================================================================
      return data.map(cell => `<${type}>${cell}</${type}>`).join('');
   }
// ####################################################################################################################################