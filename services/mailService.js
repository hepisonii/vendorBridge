const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

const sendInviteEmail = async (to, code, role) => {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject: "Your Invite Code",
    html: `
      <h2>You're invited as ${role}</h2>
      <p>Your invite code is:</p>
      <h1>${code}</h1>
      <p>This code expires soon.</p>
    `
  });
};

module.exports = { sendInviteEmail };