import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";



export const sendEmail = async (mailOptions: Mail.Options) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,

        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: true,
        },
    });
    const info = await transporter.sendMail({
        from: `"Eng/Adel" ${process.env.EMAIL}`,
        ...mailOptions,
    });

}



export const otpEmail = async () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp
};