const { sendText } = require('../modules/notifications');

const sendGameAboutToStartTxt = async (phoneNumber) => {
  const message = "gtgchamp - Your match is about to start!";
  return await sendText(phoneNumber, message);
};


const sendInviteText = async (phone) => {
  const message = "Your friend wants to compete with you. Come join ggChamp.";
  return await sendText(phone, message);
}

module.exports = {
  sendGameAboutToStartTxt,
  sendInviteText,
};