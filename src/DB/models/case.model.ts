import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CasePriorityEnum, CaseStatusEnum } from 'src/common/enums';

// Case Interface
export interface ICase {
    title: string;
    description: string;
    status: CaseStatusEnum;
    priority: CasePriorityEnum;
    createdBy: string;
    involvedUsers: string[];
    isActive: boolean;
    freazed: boolean;
    freezedBy: string;
}

// Case Schema
@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Case {
    @Prop({ type: String, minlength: 5, maxlength: 100, required: true })
    title: string
    @Prop({ type: String, minlength: 5, maxlength: 500, required: true })
    description: string
    @Prop({ type: String, enum: CaseStatusEnum, default: CaseStatusEnum.New })
    status: CaseStatusEnum
    @Prop({ type: String, enum: CasePriorityEnum, default: CasePriorityEnum.High })
    priority: CasePriorityEnum
    @Prop({ type: String, required: true })
    createdBy: string
    @Prop({ type: [String], required: true })
    involvedUsers: string[]
    @Prop({ type: Boolean, default: true })
    isActive: boolean
    @Prop({ type: Boolean })
    freazed: boolean
    @Prop({ type: String })
    freezedBy: string

}

export const CaseSchema = SchemaFactory.createForClass(Case)
// Model name for NestJS dependency injection
export const CaseModel = MongooseModule.forFeature([{ name: Case.name, schema: CaseSchema }])

// Hydrated Case Document
export type HydratedCaseDocument = HydratedDocument<ICase>;
