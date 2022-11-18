// ####################################################################################################################################

   module.exports = main;

// ####################################################################################################################################
   function main(event, tabToGo) {

      if (tabToGo === 'home') {
         document.getElementsByClassName('one')[0].click();
      } else if (tabToGo === 'dashboard') {
         document.getElementsByClassName('two')[0].click();
      } else if (tabToGo === 'sentError') {
         document.getElementsByClassName('three')[0].click();
      } else if (tabToGo === 'settings') {
         document.getElementsByClassName('four')[0].click();
      } else if (tabToGo === 'whatsapp') {
         document.getElementsByClassName('five')[0].click();
      }

   }

// ####################################################################################################################################

