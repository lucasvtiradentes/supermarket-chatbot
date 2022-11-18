// ####################################################################################################################################
   const mongodb = require('mongodb');

// ####################################################################################################################################
   module.exports = connectToDatabase;

// ####################################################################################################################################
   async function connectToDatabase() {

      // _______________________________________________________________________
      const database_username = process.env.DATABASE_USERNAME;
      const database_password = process.env.DATABASE_PASSWORD;
      const database_link = process.env.DATABASE_LINK;
      const database_name = process.env.DATABASE_NAME;

      // _______________________________________________________________________
      const db_url = `mongodb+srv://${database_username}:${database_password}@${database_link}/${database_name}?retryWrites=true&w=majority`;
      const db_options = {
         useNewUrlParser    : true,
         useUnifiedTopology : true
      };

      try {
         const mongo = mongodb.MongoClient;
         const client = await mongo.connect(db_url, db_options);
         const db = client.db(database_name);
         return db;
      } catch (e) {
         return false;
      }

   }

// ####################################################################################################################################
