import { BadRequestException, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { OtpModel, OtpRepository, UserModel, UserRepository } from "src/DB";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "src/common/service/token.service";
import { MulterModule } from "@nestjs/platform-express";

import { S3Service } from "src/common/service/s3.service";




@Module({
  imports: [
    UserModel,
    OtpModel,
    MulterModule.register()
  ],

  controllers: [AuthController],
  providers: [AuthService, UserRepository, OtpRepository, TokenService, JwtService, S3Service]
})
export class AuthModule {
}   