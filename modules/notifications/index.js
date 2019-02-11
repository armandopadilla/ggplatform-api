const AWS = require('aws-sdk');
const {
  aws,
  company,
} = require('../../config');



/**
 * Send push message
 *
 * @param text
 */
const sendPush = (text) => {
  // Grab the text
  // Do the push
};


/**
 * Send email
 *
 * @param subject
 * @param body
 * @param to
 */
const sendEmail = async (subject, body, to) => {
  const ses = new AWS.SES({
    accessKeyId: aws.auth.ACCESS_KEY_ID,
    secretAccessKey: aws.auth.SECRET_KEY,
    region: aws.ses.region
  });

  const params = {
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: body
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject
      }
    },
    Source: company.COMPANY_WELCOME_FROM_EMAIL_ADDRESS,
  };

  return await ses.sendEmail(params).promise();
};


module.exports = {
  sendPush,
  sendEmail,
};
