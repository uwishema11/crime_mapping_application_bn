import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (
  email: string,
  template: string
) => {
  try {
    console.log('Creating transporter with:', {
      service: 'gmail',
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });


    await transporter.verify();
    console.log('Transporter verified successfully');

    const mailOptions = {
      from: `Crime Mapping Team<${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Account',
      html: template,
    };

    console.log('Sending email to:', email);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);

    return info;
  } catch (error: any) {
    console.error('Detailed email sending error:', {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack,
    });
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};
