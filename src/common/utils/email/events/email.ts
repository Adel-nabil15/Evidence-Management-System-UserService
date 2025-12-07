import { OtpEnum } from "src/common/enums";
import { otpEmail, sendEmail } from "../services/send.email";
import { emailTemplateOtp } from "../template/email.temp";
import { EventEmitter } from "stream";

export const eventemetter = new EventEmitter();


// ======================= Send Email Otp =======================
eventemetter.on(OtpEnum.EmailVerification, async (data: { email: string, otp: number }) => {
    const { email, otp } = data
    await sendEmail({
        to: email,
        subject: "Email Confirmation",
        html: emailTemplateOtp(otp, "Confirm Your Email")
    })
})

// ===================== Send forget password Otp ======================
eventemetter.on(OtpEnum.ForgetPassword, async (data) => {
    const { email, otp } = data
    await sendEmail({
        to: email,
        subject: "Email Forget Password",
        html: emailTemplateOtp(otp, "Forget Password Otp")
    })
})