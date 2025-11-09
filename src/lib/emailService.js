// lib/emailService.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendVerificationEmail(email, verificationCode, userName) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your SwiftBill Account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">SwiftBill</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Email Verification</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Hello ${userName},</h2>
          <p style="color: #6b7280; line-height: 1.6; margin-bottom: 25px;">
            Thank you for creating your SwiftBill account! To complete your registration and start using our services, please verify your email address using the code below:
          </p>
          
          <div style="background: white; border: 2px dashed #d1d5db; border-radius: 12px; padding: 25px; text-align: center; margin: 25px 0;">
            <div style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">Your verification code:</div>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e40af; background: #eff6ff; padding: 15px; border-radius: 8px;">
              ${verificationCode}
            </div>
          </div>
          
          <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
            This code will expire in 15 minutes. If you didn't create an account with SwiftBill, please ignore this email.
          </p>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              If you're having trouble with the code, you can copy and paste it directly.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
}
