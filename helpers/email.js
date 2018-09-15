const { sendEmail } = require('../modules/notifications');

/**
 * Send out the welcome email.
 * @todo move this to a util
 *
 * @param account
 */
const sendWelcomeEmail = async (email) => {
  const subject = 'Welcome to gglol!';
  const body = 'Some welcome email copy goes here.  Your gglol success team!';
  await sendEmail(subject, body, email);
};

const sendDepositReceiptEmail = async (email) => {
  const subject = 'gglol Account Deposit';
  const body = 'Looks like you deposited $X.00. Coo. Your gglol success team!';
  await sendEmail(subject, body, email);
};

module.exports = {
  sendWelcomeEmail,
  sendDepositReceiptEmail,
};
