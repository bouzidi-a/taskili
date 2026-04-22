const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, fullName, code) => {
  await transporter.sendMail({
    from: `"Taskili Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email - Taskili",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2563eb;">Welcome to Taskili, ${fullName}! 👋</h2>
        <p>Use the code below to verify your email address:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #2563eb; text-align: center; padding: 20px; background: #f0f4ff; border-radius: 8px; margin: 20px 0;">
          ${code}
        </div>
        <p style="color: #666;">This code expires in <strong>10 minutes</strong>.</p>
        <p style="color: #666;">If you didn't create an account, ignore this email.</p>
      </div>
    `,
  });
};

module.exports = sendVerificationEmail;