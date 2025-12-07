import { SetMetadata } from "@nestjs/common"
import { RoleEnum } from "../enums"

export const RoleStatic = "role_type"

export const Role = (userRole: RoleEnum[]) => SetMetadata(RoleStatic, userRole)