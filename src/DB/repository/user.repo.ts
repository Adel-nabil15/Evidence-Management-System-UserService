import { Model } from "mongoose";
import { HydratedUserDocument, User } from "../models";
import { DatabaseRepository } from "./db.repo";
import { InjectModel } from "@nestjs/mongoose";


export class UserRepository extends DatabaseRepository<HydratedUserDocument> {
    constructor(@InjectModel(User.name) protected override readonly _model: Model<HydratedUserDocument>) {
        super(_model)
    }
}