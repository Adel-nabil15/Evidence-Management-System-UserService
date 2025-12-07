import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { HASH } from "src/common";
import { GenderEnum, ProviderEnum, RoleEnum } from "src/common/enums";
import type { HydratedOtpDocument } from "./otp.model";



@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User {
    @Prop({ type: String, required: true, trim: true, minlength: 3, maxlength: 200 })
    firstName: string
    @Prop({ type: String, required: true, trim: true, minlength: 3, maxlength: 200 })
    lastName: string

    @Virtual({
        get() { return this.firstName + " " + this.lastName },
        set(v: string) { this.firstName = v.split(" ")[0], this.lastName = v.split(" ")[1] }
    })
    userName: string;
    @Prop({ type: String, trim: true })
    profileImage: string
    @Prop({ type: String, required: true, trim: true, unique: true })
    email: string
    @Prop({
        type: String,
        required: function (this: User) {
            return this.provider === ProviderEnum.system ? true : false
        }
    })
    password: string
    @Prop({ type: String, enum: GenderEnum, default: GenderEnum.male, trim: true })
    gender: GenderEnum
    @Prop({ type: String, enum: RoleEnum, default: RoleEnum.user, required: true, trim: true })
    role: RoleEnum

    @Prop({
        type: String,
        enum: ProviderEnum,
        default: ProviderEnum.system
    })
    provider: ProviderEnum
    @Prop({ type: Boolean })
    freazed: boolean
    @Prop({ type: Date })
    timeChangePassword: Date

    @Prop({ type: Boolean, default: false })
    confirmed: boolean

    @Virtual()
    otp: HydratedOtpDocument
}
// otp virtual 
export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.virtual("otp", {
    ref: "Otp",
    localField: "_id",
    foreignField: "createdBy",
})
// hash password
UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await HASH(this.password)
    }
    next()
})

export type HydratedUserDocument = HydratedDocument<User>

export const UserModel = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
