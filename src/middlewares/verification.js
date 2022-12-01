const sendGrid = require('@sendgrid/mail');
const { SEND_GRID, OWNER_EMAIL, PORT } = require('../config/config')

const verifyEmail = async (email, token) => {
    const url = `http://localhost:${PORT}/api/users/verify/${token}`
    sendGrid.setApiKey(SEND_GRID);
    const confirmEmail = {
        from: OWNER_EMAIL,
        to: email,
        subject: "Please confirm your e-mail",
        html: `<h1>Confirm your email</h1><a href='${url}'>Click link for confirmation</a>`
    };
    await sendGrid.send(confirmEmail)
};

module.exports = {
    verifyEmail
}