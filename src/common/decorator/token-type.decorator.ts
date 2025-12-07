

import { SetMetadata } from "@nestjs/common";
import { TokenTypeEnum } from "src/common/enums/tokentype.enum";




export const TokenTypeStatic = "TokenType"
export const TokenType = (type: TokenTypeEnum = TokenTypeEnum.accesstoken) => SetMetadata(TokenTypeStatic, type)