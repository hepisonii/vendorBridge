const InviteCode = require("../../models/InviteCode");
const crypto = require("crypto");

const generateInviteCode = async (req, res) => {
  try {
    const { email, role } = req.body;

    // 🔐 generate random code
    const code = crypto.randomBytes(3).toString("hex").toUpperCase();

    const invite = await InviteCode.create({
      code,
      email,
      role,
      createdBy: req.user._id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60) // 1 hour
    });

    // 📧 send email (we'll plug below)
    await sendInviteEmail(email, code, role);

    res.json({
      message: "Invite code sent successfully"
    });

  } catch (err) {
    res.status(500).json({ message: "Error generating invite" });
  }
};

module.exports = {generateInviteCode}