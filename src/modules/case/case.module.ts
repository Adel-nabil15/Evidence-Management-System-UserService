import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { CaseController } from "./case.controller";
import { CaseService } from "./case.service";
import { CaseRepository, UserModel, UserRepository, CaseModel } from "src/DB";
import { MulterModule } from "@nestjs/platform-express";
import { S3Service } from "src/common/service/s3.service";
import { TokenService } from "src/common/service/token.service";


@Module({
    imports: [
        CaseModel,
        MulterModule.register(),
        UserModel
    ],
    controllers: [CaseController],
    providers: [CaseService, CaseRepository, S3Service, TokenService, JwtService, UserRepository]
})
export class CaseModule { }