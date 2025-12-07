import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthenticationGuard } from "src/common/guards/authentication/authentication.guard";
import { AuthorizationGuard } from "src/common/guards/authentication/authorization.guard";
import { Role } from "./role-type.decorator";
import { RoleEnum, TokenTypeEnum } from "src/common/enums";
import { TokenType } from "./token-type.decorator";


export function Auth({
    type = TokenTypeEnum.accesstoken,
    userRole = [RoleEnum.user]
}: {
    type?: TokenTypeEnum,
    userRole?: RoleEnum[]
} = {}
) {
    return applyDecorators(
        TokenType(type),
        Role(userRole),
        UseGuards(AuthenticationGuard, AuthorizationGuard)
    )
}