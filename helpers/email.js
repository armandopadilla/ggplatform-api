const { sendEmail } = require('../modules/notifications');

/**
 * Send out the welcome email.
 * @todo move this to a util
 *
 * @param account
 */
const sendWelcomeEmail = async (email) => {
  if (!email) throw new Error('email required');

  const subject = 'Welcome to gglol!';
  const body = 'Some welcome email copy goes here.  Your gglol success team!';
  return await sendEmail(subject, body, email);
};

const sendDepositReceiptEmail = async (email) => {
  const subject = 'gglol Account Deposit';
  const body = 'Looks like you deposited $X.00. Coo. Your gglol success team!';
  return await sendEmail(subject, body, email);
};


const sendLeaveContestEmail = async(email) => {
  const subject = 'gglol You Left Contest';
  const body = 'Aww sucks! You successfully left a contest.  We\'ve refunded your wallet.';
  return await sendEmail(subject, body, email);
}

module.exports = {
  sendWelcomeEmail,
  sendDepositReceiptEmail,
  sendLeaveContestEmail,
};
