import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { HASH, OtpEnum } from "src/common";
import { eventemetter } from "src/common/utils/email";




@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Otp {

    @Prop({ type: String, required: true, trim: true })
    code: string

    @Prop({ type: Date, required: true })
    expireAt: Date

    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    createdBy: Types.ObjectId

    @Prop({ type: String, enum: OtpEnum, required: true })
    type: OtpEnum
}

export const OtpSchema = SchemaFactory.createForClass(Otp)
OtpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })
// hash code
OtpSchema.pre("save", async function (this: HydratedOtpDocument & { is_new: boolean, plain_code: string }, next) {
    if (this.isModified("code")) {
        this.plain_code = this.code
        this.is_new = this.isNew
        this.code = await HASH(this.code)
        await this.populate({ path: "createdBy", select: "email" })
    }
    next()
})


OtpSchema.post("save", async function (doc, next) {
    const that = this as HydratedOtpDocument & { is_new: boolean, plain_code: string }
    if (that.is_new) {
        eventemetter.emit(doc.type, { email: doc.createdBy["email"], otp: that.plain_code })
    }
    next()
})


export type HydratedOtpDocument = HydratedDocument<Otp>
export const OtpModel = MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }])