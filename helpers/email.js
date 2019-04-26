const { sendEmail } = require('../modules/notifications');

/**
 * Send out the welcome email.
 * @todo move this to a util
 *
 * @param account
 */
// @todo - move this to a config.
const sendWelcomeEmail = async (email) => {
  if (!email) throw new Error('email required');

  const subject = 'Welcome to gtgchamp.com!';
  const body = 'You\'re hooked up to start earning with your skills.  Invite ' +
    'your friends to a scheduled matches, battle on your favorite platform, win, come back to see ' +
    'your earnings!  Get started now.  <br><br>Your X success team!';
  return await sendEmail(subject, body, email);
};

// When the user deposits money into the account.
const sendDepositReceiptEmail = async (email, amount) => {
  const subject = 'X Account Deposit';
  const body = `Looks like you deposited $${amount.toFixed(2)}. Coo. Your X success team!`;
  return await sendEmail(subject, body, email);
};


// Used when the user takes out money for match reasons.
const sendWidthdrawReceiptEmail = async (email, amount) => {
  const subject = 'X Account Widthraw';
  const body = `Looks like you widthrew $${amount.toFixed(2)} to join a match. Coo! If you did not initiate this transaction
     dont sweat it, email our support success team and we'll sort this out for you. Your X success team!`;
  return await sendEmail(subject, body, email);
};

// Used when a user takes out money from their wallet.  For non match reasons.
const sendWidthdrawFundsReceiptEmail = async (email, amount) => {
  const subject = 'X Account Widthraw';
  const body = `Looks like you widthrew ${amount.toFixed(2)} to join a match. Coo! If you did not initiate this transaction
    dont sweat it, email our support success team and we'll sort this out for you. Your X success team!`;
  return await sendEmail(subject, body, email);
};

const sendLeaveGameEmail = async(email) => {
  const subject = 'X You Left Contest';
  const body = 'Aww sucks! You successfully left a contest.  We\'ve refunded your wallet.';
  return await sendEmail(subject, body, email);
};

const sendLeaveContestEmail = async (email) => {
  const subject = 'X You Left Contest';
  const body = 'Aww sucks! You successfully left a contest.  We\'ve refunded your wallet.';
  return await sendEmail(subject, body, email);
};

const sendInviteEmail = async (email) => {
  const subject = "You've been invited to compete!";
  const body = 'Hey, your buddy has just invited you to compete.  Come join us where you can schedule a game, play your game, come back and see what you won.\n\nggChamp.com';
  return await sendEmail(subject, body, email);
}


module.exports = {
  sendWelcomeEmail,
  sendDepositReceiptEmail,
  sendLeaveGameEmail,
  sendWidthdrawReceiptEmail,
  sendInviteEmail,
};
