/**
 * Send out reminders of games starting in 15 minutes.
 * Will send out reminders to only the participants.
 *
 */
const moment = require('moment');
const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const dbInfo = config.db;

const dbClient = new MongoClient(dbInfo.connInfo.url);
return dbClient.connect((err) => {

  const db = dbClient.db(dbInfo.connInfo.dbName);

  return db.collection(dbInfo.GAME_COLL_NAME)
    .find({
      startDateTime: { eq: moment().add(15, 'minutes') } //Starts in 15 minutes.
    })
    .toArray()
    .then((games) => {
      return games.forEach((game) => {

        const participants = game.participants;
        participants.forEach((user) => {
          console.log(user);
          // Send out a message
        });

      });
    });
});



