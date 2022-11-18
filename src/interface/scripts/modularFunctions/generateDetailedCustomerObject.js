// ####################################################################################################################################
   const getAppsuperColumns = require('../../../configs.json');

// ####################################################################################################################################
   module.exports = genereteDetailedCustomerObject;

// ####################################################################################################################################

   function genereteDetailedCustomerObject(customerObj) { // ============================================================

      // _______________________________________________________________________
      const customer_first_name = getCustomerFirstName(customerObj.customer_name);
      const getCategorizedProducts = categorizeProducts(customerObj.order_products);

      // _______________________________________________________________________
      const bulkProducts = getSpecifiedCategoryProducts(getCategorizedProducts, 'bulk');
      const regularProducts = getSpecifiedCategoryProducts(getCategorizedProducts, 'regular');

      const bulkTotalOccurrencesProducts = getSpecifiedCategoryProducts(getCategorizedProducts, 'bulkTotalOccurrence');
      const regularTotalOccurrencesProducts = getSpecifiedCategoryProducts(getCategorizedProducts, 'regularTotalOccurrence');
      const regularPartialOccurencesProducts = getSpecifiedCategoryProducts(getCategorizedProducts, 'regularPartialOccurrence');

      const categorizedProducts = {
         getCategorizedProducts,
         regularProducts,
         regularTotalOccurrencesProducts,
         regularPartialOccurencesProducts,
         bulkProducts,
         bulkTotalOccurrencesProducts
      };

      // _______________________________________________________________________
      const allProductsFinalPrice = getAggregateProductsPrice(getCategorizedProducts, 'final');

      const bulkProductsInitialPrice = getAggregateProductsPrice(bulkProducts, 'initial');
      const bulkProductsFinalPrice = getAggregateProductsPrice(bulkProducts, 'final');
      const bulkProductsDifferencePrice = Number(bulkProductsFinalPrice) - Number(bulkProductsInitialPrice);

      const bulkTotalOccurrencesProductsPrice = Number(getAggregateProductsPrice(bulkTotalOccurrencesProducts, 'final') * -1);

      const regularProductsPrice = getAggregateProductsPrice(regularProducts, 'final');

      const regularTotalOccurrencesProductsPrice = Number(getAggregateProductsPrice(regularTotalOccurrencesProducts, 'final') * -1);

      const regularPartialOccurencesProductsInitialPrice = getAggregateProductsPrice(regularPartialOccurencesProducts, 'initial');
      const regularPartialOccurencesProductsFinalPrice = getAggregateProductsPrice(regularPartialOccurencesProducts, 'final');
      const regularPartialOccurrencesDifferencePrice = Number(regularPartialOccurencesProductsFinalPrice) - Number(regularPartialOccurencesProductsInitialPrice);

      const categorizedProductsPrices = {
         allProductsFinalPrice,

         bulkProductsInitialPrice,
         bulkProductsFinalPrice,
         bulkProductsDifferencePrice,

         bulkTotalOccurrencesProductsPrice,

         regularProductsPrice,
         regularTotalOccurrencesProductsPrice,

         regularPartialOccurencesProductsInitialPrice,
         regularPartialOccurencesProductsFinalPrice,
         regularPartialOccurrencesDifferencePrice,
      };

      // _______________________________________________________________________

      const acquiredPrice = ((Number(regularProductsPrice) + Number(regularPartialOccurencesProductsInitialPrice) - Number(regularTotalOccurrencesProductsPrice)) + (Number(bulkProductsInitialPrice) - Number(bulkTotalOccurrencesProductsPrice))).toFixed(2); // Valor adquirido
      const autorizedPrice = (Number(acquiredPrice) + Number(bulkProductsDifferencePrice) + Number(regularPartialOccurrencesDifferencePrice)).toFixed(2); // Valor inicial do pedido:
      const totalOcurrencePrice = (Number(bulkTotalOccurrencesProductsPrice) + Number(regularTotalOccurrencesProductsPrice)).toFixed(2);
      const finalPrice = (Number(autorizedPrice) + Number(totalOcurrencePrice)).toFixed(2); // Total do Pedido:
      const superTax = (Number(finalPrice) < 100 ? 3 : 0.03 * Number(finalPrice)).toFixed(3);

      const utilProductsPrices = {
         totalOcurrencePrice,
         regularPartialOccurrencesDifferencePrice,
         bulkProductsDifferencePrice,

         acquiredPrice,
         autorizedPrice,
         finalPrice,
         superTax
      };

      // _______________________________________________________________________
      const order_detailed_info = {
         customer_first_name,
         categorizedProducts,
         categorizedProductsPrices,
         utilProductsPrices
      };

      const detailedCustomerObject = {
         ...customerObj,
         order_detailed_info
      };

      return detailedCustomerObject;
   }

// ####################################################################################################################################

   function getCustomerFirstName(customercompleteName) { // =============================================================
      return customercompleteName.split(' ')[0];
   }

// ####################################################################################################################################

   function categorizeProducts(products) { // ===========================================================================

      const productsCategorized = new Array();

      for (let x = 0; x < products.length; x++) {

         let product = products[x];

         let productCategory = getProductType(product);
         if (isRegularTotalOccurrence(product)) {productCategory = 'regularTotalOccurrence';}
         if (isRegularPartialOccurrence(product)) {productCategory = 'regularPartialOccurrence';}
         if (isBulkTotalOccurrence(product)) {productCategory = 'bulkTotalOccurrence';}

         product.push(productCategory);
         productsCategorized.push(product);
      }

      return productsCategorized;
   }

// ####################################################################################################################################

   function getSpecifiedCategoryProducts(productsCategorized, category) { // ================================================

      let specifiedCategoryProducts = new Array();

      for (let x = 0; x < productsCategorized.length; x++) {
         const product = productsCategorized[x];
         const productCategory = product[product.length - 1];

         if (productCategory === category) {
            specifiedCategoryProducts.push(product);
         }
      }

      return specifiedCategoryProducts;
   }

   function getProductType(product) { // ================================================================================

      const {bulkColumn} = getAppsuperColumns;
      const bulkColumnContent = product[bulkColumn];

      if (bulkColumnContent === '-') {
         return 'regular';
      } else {
         return 'bulk';
      }
   }

   function isTotalOccurrence(product) { // =============================================================================

      const {occurrenceColumn} = getAppsuperColumns;
      const occurrenceColumnContent = product[occurrenceColumn];

      if (occurrenceColumnContent === '') {
         return true;
      } else {
         return false;
      }

   }

   function isPartialOccurrence(product) { // ===========================================================================

      const {initialQuantityColumn, finalQuantityColumn} = getAppsuperColumns;

      const productInitialQuantity = product[initialQuantityColumn];
      const productFinalQuantity = product[finalQuantityColumn];

      if (productInitialQuantity !== productFinalQuantity) {
         return true;
      } else {
         return false;
      }

   }

// ####################################################################################################################################

   function isRegularTotalOccurrence(product) { // ======================================================================

      if (getProductType(product) === 'regular' && isTotalOccurrence(product)) {
         return true;
      } else {
         return false;
      }

   }

   function isRegularPartialOccurrence(product) { // ====================================================================

      if (getProductType(product) === 'regular' && isPartialOccurrence(product)) {
         return true;
      } else {
         return false;
      }

   }

   function isBulkTotalOccurrence(product) { // ========================================================================================

      if (getProductType(product) === 'bulk' && isTotalOccurrence(product)) {
         return true;
      } else {
         return false;
      }

   }

// ####################################################################################################################################

   function getAggregateProductsPrice(productsArr, sumType) { // =====================================

      const {initialQuantityColumn, finalQuantityColumn, initialPriceColumn, finalPriceColumn} = getAppsuperColumns;
      const priceToSum = sumType === 'final' ? finalPriceColumn : initialPriceColumn;
      const quantityToSum = sumType === 'final' ? finalQuantityColumn : initialQuantityColumn;

      let productsPrice = 0;

      for (let x = 0; x < productsArr.length; x++) {

         const product = productsArr[x];

         const productQuantity = parseFloat(product[quantityToSum].replace(',', '.'));
         const productPrice = parseFloat(product[priceToSum].replace(',', '.'));
         const productValue = Number((productQuantity * productPrice));

         productsPrice = Number(productsPrice + productValue);

      }

      return Number(productsPrice.toFixed(2));
   }

// ####################################################################################################################################