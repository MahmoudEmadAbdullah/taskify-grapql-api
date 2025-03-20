const nodemailer = require('nodemailer');

const sendEmail = async(options) => {
    // Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        }
    });
    // Defined email options
    const mailOptions = {
        from: `Our-GraphQL App <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    // Send email
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;



// Reset Password Email Template
module.exports.resetPasswordTemplate = (name, resetCode) => `
Hi ${name},\n
We received a request to reset the password on your Account.\n
Your reset code is: ${resetCode}\n
Enter this code to complete the reset.\n
Thanks for helping us keep your account secure.\n
The Our-GrahQL App Team
`;


// Verify email
module.exports.verificationTemplate = (name, code) => `
Hi ${name},\n
Your email verification code is: ${code}.\n
The Our-GrahQL App Team
`;