import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (
  email: string,
  template: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 587,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: `UC E-commerce Team<${process.env.USER_EMAIL}>`,
      to: email,
      subject: 'Verify Your Account',
      html: template,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send verification email');
  }
};
