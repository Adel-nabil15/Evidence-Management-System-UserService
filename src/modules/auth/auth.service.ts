import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { HydratedUserDocument, OtpRepository, UserRepository } from "src/DB";
import { otpEmail } from "src/common/utils/email";
import { COMPARE, GTOKEN, OtpEnum, RoleEnum, TokenTypeEnum } from "src/common";
import { LoginDto, ResendOtpDto, SignUpDto } from "./dto";
import { ConfirmEmailDto } from "./dto/confirm-email.dto";
import { TokenService } from "src/common/service/token.service";
import { S3Service } from "src/common/service/s3.service";
import { ForgetPasswordDto, ResetPasswordDto } from "./dto/forget-password.dto";





@Injectable()
export class AuthService {
    constructor(
        private _userRepository: UserRepository,
        private _otpRepository: OtpRepository,
        private _tokenService: TokenService,
        private _s3Service: S3Service
    ) { }

    // ======================= Sign Up =======================
    async SignUp_S(Body: SignUpDto): Promise<HydratedUserDocument> {
        const { firstName, lastName, email, password } = Body
        const user = await this._userRepository.findOne(
            { filter: { email } }
        )
        if (user) {
            throw new BadRequestException("User already exists")
        }
        const newUser = await this._userRepository.create({
            firstName,
            lastName,
            email,
            password
        })
        if (!newUser) {
            throw new NotFoundException("User not found")
        }
        await this.createOtp(newUser, OtpEnum.EmailVerification)
        return newUser.populate("otp")
    }

    // ======================= Resend Otp =======================
    async ResendOtp_S(Body: ResendOtpDto): Promise<any> {
        const { email } = Body
        const user = await this._userRepository.findOne({
            filter: {
                email: email,
                confirmed: false
            },
            options: { populate: { path: "otp" } }
        })
        if (!user) throw new NotFoundException("User not found ")
        if (user.otp["length"] > 0) {
            throw new BadRequestException("Otp already sent")
        }
        await this.createOtp(user, OtpEnum.EmailVerification)

        return user.populate("otp")
    }

    // ======================= Confirm Email =======================
    async confirmEmail_S(Body: ConfirmEmailDto): Promise<any> {
        const { email, code } = Body
        const user = await this._userRepository.findOne({
            filter: {
                email,
                confirmed: false
            },
            options: { populate: { path: "otp" } }
        })
        if (!user) throw new NotFoundException("User not found ")
        if (user.otp["length"] === 0) {
            throw new BadRequestException("Otp not found")
        }
        const match = await COMPARE(code, user.otp[0].code)
        if (!match) {
            throw new BadRequestException("Invalid Otp")
        }
        user.confirmed = true
        await user.save()
        await this._otpRepository.deleteOne({ createdBy: user._id })
        return { message: "Email confirmed successfully" }

    }

    // ======================= login =======================
    async login_S(Body: LoginDto): Promise<any> {
        const { email, password } = Body
        const user = await this._userRepository.findOne({
            filter: {
                email,
                confirmed: true, freazed: { $exists: false }
            },
        })
        if (!user) throw new NotFoundException("User not found")
        const match = await COMPARE(password, user.password)
        if (!match) {
            throw new BadRequestException("Invalid password")
        }
        const access_token = await this._tokenService.GnerateToken(
            {
                paylod: { id: user._id, role: user.role },
                options: {
                    secret: user.role === RoleEnum.user ? process.env.USER_ACCESS_TOKEN! : process.env.ADMIN_ACCESS_TOKEN!,
                    expiresIn: "1h"
                }
            }
        )
        const refresh_token = await this._tokenService.GnerateToken(
            {
                paylod: { id: user._id, role: user.role },
                options: {
                    secret: user.role === RoleEnum.user ? process.env.USER_REFRESH_TOKEN! : process.env.ADMIN_REFRESH_TOKEN!,
                    expiresIn: "7d"
                }
            }
        )
        return { message: { access_token, refresh_token } }
    }
    // ======================= Refresh Token =======================
    async refreshToken_S(authorization: string): Promise<{ message: { access_token: string, refresh_token: string } }> {
        const { user } = await this._tokenService.TokenSigneture(authorization, TokenTypeEnum.refreshtoken)
        console.log("Done")
        if (!user) throw new NotFoundException("User not found")
        const access_token = await this._tokenService.GnerateToken(
            {
                paylod: { id: user._id, role: user.role },
                options: {
                    secret: user.role === RoleEnum.user ? process.env.USER_ACCESS_TOKEN! : process.env.ADMIN_ACCESS_TOKEN!,
                    expiresIn: "1h"
                }
            }
        )
        const refresh_token = await this._tokenService.GnerateToken(
            {
                paylod: { id: user._id, role: user.role },
                options: {
                    secret: user.role === RoleEnum.user ? process.env.USER_REFRESH_TOKEN! : process.env.ADMIN_REFRESH_TOKEN!,
                    expiresIn: "7d"
                }
            }
        )
        return { message: { access_token, refresh_token } }
    }



    // ======================= Forget Password =======================
    async ForgetPassword_S(body: ForgetPasswordDto): Promise<any> {
        const { email } = body
        const user = await this._userRepository.findOne({
            filter: {
                email,
                confirmed: true
            },
            options: { populate: { path: "otp" } }
        })
        if (!user) throw new NotFoundException("User not found")
        if (user.otp["length"] > 0) {
            throw new BadRequestException("Otp already sent")
        }
        await this.createOtp(user, OtpEnum.ForgetPassword)
        return { message: "Otp sent successfully" }
    }

    // ======================= Reset Password =======================
    async ResetPassword_S(body: ResetPasswordDto): Promise<any> {
        const { email, code, newPassword } = body
        const user = await this._userRepository.findOne({
            filter: {
                email,
                confirmed: true
            },
            options: { populate: { path: "otp" } }
        })
        if (!user) throw new NotFoundException("User not found")
        if (user.otp["length"] === 0) {
            throw new BadRequestException("Otp not found")
        }
        const match = await COMPARE(code, user.otp[0].code)
        if (!match) {
            throw new BadRequestException("Invalid Otp")
        }
        user.password = newPassword
        await user.save()
        await this._otpRepository.deleteOne({ createdBy: user._id })
        return { message: "Password reset successfully" }
    }



    // ======================= private Method create Otp =======================
    private async createOtp(user: HydratedUserDocument, type: OtpEnum) {
        const otp = await otpEmail()
        const newOtp = await this._otpRepository.create({
            code: otp.toString(),
            expireAt: new Date(Date.now() + 60 * 1000),
            createdBy: user._id,
            type
        })
        return newOtp
    }
} 