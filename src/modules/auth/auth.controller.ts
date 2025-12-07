import { Body, Controller, Get, ParseFilePipe, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RefreshTokenDto, ResendOtpDto, SignUpDto } from "./dto";
import { ConfirmEmailDto } from "./dto/confirm-email.dto";
import { RoleEnum, StorageType, TokenTypeEnum } from "src/common";
import { CurrentUser } from "src/common/decorator/current-user.decorator";
import { Auth } from "src/common/decorator/auth.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileType, MulterCloud } from "src/common/utils/multer";
import type { HydratedUserDocument } from "src/DB";
import { ForgetPasswordDto, ResetPasswordDto } from "./dto/forget-password.dto";


@Controller("api/auth")
export class AuthController {
  constructor(private _authService: AuthService) { }

  // ============================ Sign Up ===============================
  @Post("/SignUp")
  SignUp(@Body() Body: SignUpDto) {
    return this._authService.SignUp_S(Body)
  }

  // ============================ Resend Otp ===============================
  @Post("/ResendOtp")
  ResendOtp(@Body() Body: ResendOtpDto) {
    return this._authService.ResendOtp_S(Body)
  }
 
  // ============================ Confirm Email ===============================
  @Patch("/confirmEmail")
  confirmEmail(@Body() Body: ConfirmEmailDto) {
    return this._authService.confirmEmail_S(Body)
  }

  // ============================ Login ===============================
  @Post("/login")
  login(@Body() Body: LoginDto) {
    return this._authService.login_S(Body)
  }

  // ============================ Refresh Token ===============================
  @Post("/refreshToken")
  refreshToken(@Body() body: RefreshTokenDto) {
    return this._authService.refreshToken_S(body.authorization)
  }
  // ============================ Forget Password ===============================
  @Post("/ForgetPassword")
  ForgetPassword(@Body() body: ForgetPasswordDto) {
    return this._authService.ForgetPassword_S(body)
  }

  // ============================ Reset Password ===============================
  @Patch("/ResetPassword")
  ResetPassword(@Body() body: ResetPasswordDto) {
    return this._authService.ResetPassword_S(body)
  }

  
}    