import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Case, HydratedCaseDocument } from "../models/case.model";
import { DatabaseRepository } from "./db.repo";


export class CaseRepository extends DatabaseRepository<HydratedCaseDocument> {
    constructor(
        @InjectModel(Case.name) protected override readonly _model: Model<HydratedCaseDocument>
    ) {
        super(_model);
    }
}