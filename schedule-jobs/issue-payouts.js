// Fetch all the contest that have completed and not awarded.
// Foreach of the contests check what the win condition is - HUMMM
// Get the participants within the contest that have met the win condition
// Get the pot of the contest
// Split between the winners
// Deposit to their account
// Send out a message that they won
// Done.


const async = require('async');
const { MongoClient, ObjectId } = require('mongodb');
const config = require('../config');
const dbInfo = config.db;
const { sendGameAboutToStartTxt } = require('../helpers/text');

const dbClient = new MongoClient(dbInfo.connInfo.url);

const getConn = async () => {
  return await dbClient.connect();
};

const runner = async () => {

  const conn = await getConn();
  const db = await dbClient.db(dbInfo.connInfo.dbName);

  const contests = await db.collection(dbInfo.CONTEST_COLL_NAME).find({
    status: 'completed'
  }).toArray();

  contests.forEach(async (contest) => {

    // Foreach contest get the win condition
    // Foreach contest get the participants
    const { participants, pot } = contest;

    participants.forEach((user) => {

      // Did this user win??
      const winners = [];
      if(winner) winners.push(user);
    });

    // Get the pot of the contest
    const amountWon = pot / winners.length;

    // Issue out the amount won to each of the players that won
    winners.forEach(async (winner) => {
      // Deposit the funds for the winner
      await depositFunds(userId, amountWon);

      // Send out an email and or text
      await sendWinningEmail();
    });

    // Update the contest as 'awarded'
    await db.collection(dbInfo.CONTEST_COLL_NAME).updateOne({ _id: ObjectId(contest._id) }, {
      $set: {
        status: 'awarded'
      }
    });
    
  });

};


runner();