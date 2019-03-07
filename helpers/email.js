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

const sendDepositReceiptEmail = async (email) => {
  const subject = 'X Account Deposit';
  const body = 'Looks like you deposited $X.00. Coo. Your X success team!';
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

module.exports = {
  sendWelcomeEmail,
  sendDepositReceiptEmail,
  sendLeaveGameEmail,
};
