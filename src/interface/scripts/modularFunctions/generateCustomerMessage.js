// ####################################################################################################################################
   const getAppsuperColumns = require('../../../configs.json');
   const Store = require('electron-store');
   const storedData = new Store();

// ####################################################################################################################################
   module.exports = {
      greetingMessage,
      occurrencesMessage,
      readyForPickupMessage
   };

// ####################################################################################################################################

   function greetingMessage(customerData) { // =========================================================================

      let message;
      message = `Olá *${customerData.order_detailed_info.customer_first_name}*, obrigado por utilizar nossa plataforma e-commerce! 🛒📲` + '\n\n';

      const afterMarketDeliveryTime = Date.parse(`01/01/2011 ${customerData.order_time}`) >= Date.parse(`01/01/2011 ${storedData.get('market_settings.market_same_day_delivery_time')}`);
      console.log(afterMarketDeliveryTime + ' - ' + Date.parse(`01/01/2011 ${customerData.order_time}`) + ' - ' + Date.parse(`01/01/2011 ${storedData.get('market_settings.market_same_day_delivery_time')}`));

      if (afterMarketDeliveryTime) {
         message = message + 'Informamos que os pedidos realizados *após às ' + storedData.get('market_settings.market_closing_time') + ' h* serão entregues no dia seguinte.' + '\n\n';
      }

      message = message + `Visando agilidade e melhor atendimento para seu pedido n° *${customerData.order_number}*, ` +
                          'informaremos no momento da separação, caso algum produto do seu pedido não esteja disponível no supermercado. ' +
                          'E não se preocupe com o valor pré-aprovado, somente depois da coleta dos produtos é que faremos a captura ' +
                          'do valor atualizado da sua compra!';

      if (1 === 2) {
         message = message + '\n\n --------------------- \n' +
                             `Data do pedido: ${customerData.order_date}` + '\n' +
                             `Hora do pedido: ${customerData.order_time}` + '\n';
      }

      return message;
   }

   function occurrencesMessage(customerData) { // ======================================================================

      const {productNameColumn, initialQuantityColumn, finalQuantityColumn, initialPriceColumn, finalPriceColumn} = getAppsuperColumns;

      // -----------------------------------------------------------------------
      const bulkProducts = customerData.order_detailed_info.categorizedProducts.bulkProducts;
      const bulkTotalOccurrences = customerData.order_detailed_info.categorizedProducts.bulkTotalOccurrencesProducts;
      const regularPartialOccurrences = customerData.order_detailed_info.categorizedProducts.regularPartialOccurencesProducts;
      const regularTotalOccurrences = customerData.order_detailed_info.categorizedProducts.regularTotalOccurrencesProducts;

      const hasRegularTotalOccurrences = regularTotalOccurrences.length > 0 ? true : false;
      const hasRegularPartialOccurrences = regularPartialOccurrences.length > 0 ? true : false;
      const hasBulkTotalOccurrences = bulkTotalOccurrences.length > 0 ? true : false;

      const hasBulk = bulkProducts.length > 0 ? true : false;
      const hasOccurrences = (hasBulkTotalOccurrences || hasRegularPartialOccurrences || hasRegularTotalOccurrences) ? true : false;

      // -----------------------------------------------------------------------
      let bulkMessagePart = '';
      let occurrenceMessagePart = '';

      if (hasBulk) {
         for (let x = 0; x < bulkProducts.length; x++) {
            const product = bulkProducts[x];

            if (product[initialPriceColumn] !== product[finalPriceColumn]) {
               const productLine = `* ${product[productNameColumn].replace('.', ',')} : R$ ${product[initialPriceColumn].replace('.', ',')} -> R$ ${product[finalPriceColumn].replace('.', ',')}`;
               bulkMessagePart = !bulkMessagePart ? productLine : bulkMessagePart + '\n' + productLine;
            }
         }
      }

      if (hasOccurrences) {

         for (let x = 0; x < bulkTotalOccurrences.length; x++) {
            const product = bulkTotalOccurrences[x];
            const productLine = `* ${product[productNameColumn]} - ${product[finalQuantityColumn]} de ${product[initialQuantityColumn]} und - R$ ${product[finalPriceColumn].replace('.', ',')}`;
            occurrenceMessagePart = !occurrenceMessagePart ? productLine : occurrenceMessagePart + '\n' + productLine;
         }

         for (let x = 0; x < regularPartialOccurrences.length; x++) {
            const product = regularPartialOccurrences[x];
            const productLine = `* ${product[productNameColumn]} - ${product[finalQuantityColumn]} de ${product[initialQuantityColumn]} und - R$ ${product[finalPriceColumn].replace('.', ',')}`;
            occurrenceMessagePart = !occurrenceMessagePart ? productLine : occurrenceMessagePart + '\n' + productLine;
         }

         for (let x = 0; x < regularTotalOccurrences.length; x++) {
            const product = regularTotalOccurrences[x];
            const productLine = `* ${product[productNameColumn]} - ${product[finalQuantityColumn]} de ${product[initialQuantityColumn]} und - R$ ${product[finalPriceColumn].replace('.', ',')}`;
            occurrenceMessagePart = !occurrenceMessagePart ? productLine : occurrenceMessagePart + '\n' + productLine;
         }

      }

      // -----------------------------------------------------------------------
      bulkMessagePart = bulkMessagePart ? 'Os produtos a granel tiveram mudanças nas suas quantidades e preços, conforme é indicado a seguir: ' + '\n\n' + bulkMessagePart + '\n\n' : '';
      occurrenceMessagePart = occurrenceMessagePart ? 'Os produtos e quantidades listadas abaixo, no momento, estão em falta no supermercado: ' + '\n\n' + occurrenceMessagePart + '\n\n' : '';

      // -----------------------------------------------------------------------
      const bulkProductsDifferencePrice = Number(customerData.order_detailed_info.utilProductsPrices.bulkProductsDifferencePrice).toFixed(2);
      const bulkPartialOccurrencesPart = (hasBulk && bulkProductsDifferencePrice < 0) ? `Diferença no valor dos produtos a granel: R$ ${bulkProductsDifferencePrice.replace('.', ',')}` + '\n' : '';

      const regularPartialOccurrencesDifferencePrice = Number(customerData.order_detailed_info.utilProductsPrices.regularPartialOccurrencesDifferencePrice).toFixed(2);
      const regularPartialOccurrencesPart = (hasOccurrences && regularPartialOccurrencesDifferencePrice < 0) ? `Diferença no valor dos produtos normais com ocorrência parcial: R$ ${regularPartialOccurrencesDifferencePrice.replace('.', ',')}` + '\n' : '';

      const totalOcurrencePrice = Number(customerData.order_detailed_info.utilProductsPrices.totalOcurrencePrice).toFixed(2);
      const regularTotalOccurrencesPart = hasOccurrences ? `Diferença no valor dos produtos normais com ocorrência total: R$ ${totalOcurrencePrice.replace('.', ',')}` + '\n' : '';

      const paymentMessagePart = 'Segue abaixo o resumo das suas compras:' + '\n\n' +
                                 `Valor adquirido: R$ ${(customerData.order_detailed_info.utilProductsPrices.acquiredPrice).replace('.', ',')}` + '\n' +
                                 `${bulkPartialOccurrencesPart}` +
                                 `${regularPartialOccurrencesPart}` +
                                 `Valor autorizado: R$ ${(customerData.order_detailed_info.utilProductsPrices.autorizedPrice).replace('.', ',')}` + '\n' +
                                 `${regularTotalOccurrencesPart}` +
                                 `Valor capturado do pedido: *R$ ${(customerData.order_detailed_info.utilProductsPrices.finalPrice).replace('.', ',')}*` + '\n' +
                                 `Valor capturado da taxa: *R$ ${(customerData.order_detailed_info.utilProductsPrices.superTax).replace('.', ',')}*`;

      const message = `Oi, *${customerData.order_detailed_info.customer_first_name}*, a separação do seu pedido n° *${customerData.order_number}* foi finalizada! ` + '\n\n' +
                      `${bulkMessagePart}` +
                      `${occurrenceMessagePart}` +
                      'Informamos que vamos continuar suas compras sem este(s) produto(s), neste caso o valor é atualizado, descontando os produtos que estavam em falta. O tempo para atualização dos valores ocorre de acordo com seu banco, mas fique tranquilo(a), logo o valor correto aparecerá para você disponível em sua fatura.' + '\n\n' +
                      `${paymentMessagePart}`;

      if (customerData.order_detailed_info.utilProductsPrices.acquiredPrice === customerData.order_detailed_info.utilProductsPrices.finalPrice) {
         return false;
      } else {
         return message;
      }

   }

   function readyForPickupMessage(customerData) { // ===================================================================

      let message;
      const afterMarketClosingTime = Date.parse(`01/01/2011 ${customerData.order_time}`) >= Date.parse(`01/01/2011 ${storedData.get('market_settings.market_closing_time')}`);
      console.log(afterMarketClosingTime + ' - ' + Date.parse(`01/01/2011 ${customerData.order_time}`) + ' - ' + Date.parse(`01/01/2011 ${storedData.get('market_settings.market_closing_time')}`));

      message = `Olá *${customerData.order_detailed_info.customer_first_name}*, seu pedido n° *${customerData.order_number}* está pronto para retirada no ${customerData.market_name}!` + '\n\n';

      if (afterMarketClosingTime) {
         message = message + 'Entretanto o mercado encontra-se fechado, passe amanhã para buscá-lo!';
      } else {
         message = message + `O mercado fica aberto até às ${storedData.get('market_settings.market_closing_time')}, venha já buscá-lo!`;
      }

      if (1 === 2) {
         message = message + '\n\n ---------------------  \n' +
                             `Data do pedido: ${customerData.order_date}` + '\n' +
                             `Hora do pedido: ${customerData.order_time}` + '\n';
      }

      return message;
   }

// ####################################################################################################################################