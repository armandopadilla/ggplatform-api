/**
 * Send out reminders of games starting in 15 minutes.
 * Will send out reminders to only the participants.
 *
 */
const async = require('async');
const moment = require('moment');
const { MongoClient, ObjectId } = require('mongodb');
const config = require('../config');
const dbInfo = config.db;
const { sendGameAboutToStartTxt } = require('../helpers/text');

const dbClient = new MongoClient(dbInfo.connInfo.url);

const START_TIME = 15;
const TIME_FRAME = 'minutes';

const getConn = async () => {
  return await dbClient.connect();
};

const runner = async () => {

  const conn = await getConn();
  const db = await dbClient.db(dbInfo.connInfo.dbName);

  const games = await db.collection(dbInfo.GAME_COLL_NAME).find({
    startDateTime: { eq: moment().add(START_TIME, TIME_FRAME) } //Starts in 15 minutes.
  }).toArray();

  async.each(games, (game, cb) => {

    const {participants} = game;

    async.each(participants, async(user, cb2) => {

      const userInfo = await db.collection(dbInfo.USER_COLL_NAME).findOne({ _id: ObjectId(user) });

      // Send out a message - Async
      const { number } = userInfo;
      await sendGameAboutToStartTxt(number);

      cb2();
    }, (err) => {
      cb();
    });

  }, () => {
    process.exit(0);
  });
};


runner();