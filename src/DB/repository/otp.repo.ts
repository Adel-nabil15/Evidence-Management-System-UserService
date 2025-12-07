import { Model } from "mongoose";
import { HydratedOtpDocument, Otp } from "../models";
import { DatabaseRepository } from "./db.repo";
import { InjectModel } from "@nestjs/mongoose";


export class OtpRepository extends DatabaseRepository<HydratedOtpDocument> {
    constructor(@InjectModel(Otp.name) protected override readonly _model: Model<HydratedOtpDocument>) {
        super(_model)
    }
}