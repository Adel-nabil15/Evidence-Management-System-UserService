import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt"
import { UserRepository } from "src/DB"
import { TokenTypeEnum } from "../enums/tokentype.enum"
import { JwtPayload } from "jsonwebtoken"



@Injectable()
export class TokenService {
    constructor(
        private _userRepository: UserRepository,
        private _JwtService: JwtService
    ) { }

    // ======================= Generate token ========================
    GnerateToken = async ({ paylod, options }: {
        paylod: object,
        options: JwtSignOptions
    }): Promise<string> => {
        return this._JwtService.signAsync(paylod, options)
    }
    // ======================= Verify token ========================
    VerifyToken = async ({ token, options }: {
        token: string,
        options: JwtVerifyOptions
    }): Promise<JwtPayload> => {
        return this._JwtService.verifyAsync(token, options)
    }
    // ======================= Token Signeture ========================
    TokenSigneture = async (authorization: string, type: string = TokenTypeEnum.accesstoken) => {
        try {
            if (!authorization) throw new BadRequestException("authorization is reuired")
            let [prefix, token] = authorization.split(" ")
            if (!prefix || !token) throw new BadRequestException("Invalid prefix or token")
            let TOKEN_ACCESS = "";
            let TOKEN_REFRESH = "";

            if (prefix === "Bearer") {
                TOKEN_ACCESS = process.env.USER_ACCESS_TOKEN!;
                TOKEN_REFRESH = process.env.USER_REFRESH_TOKEN!;
            } else if (prefix === "Admin") {
                TOKEN_ACCESS = process.env.ADMIN_ACCESS_TOKEN!;
                TOKEN_REFRESH = process.env.ADMIN_REFRESH_TOKEN!;
            } else {
                throw new BadRequestException(`Invalid token type: ${prefix}`);
            }
            const decoded = await this.VerifyToken({
                token,
                options: { secret: type === TokenTypeEnum.accesstoken ? TOKEN_ACCESS! : TOKEN_REFRESH! } as JwtVerifyOptions,
            })
            if (!decoded?.id) throw new BadRequestException("invalid token")
            // check if token is revoked
            // if (await _RevokeTokenModel.findOne({ tokenid: decoded.jti })) throw new BadRequestException("token is revoked")
            // // check if user is exist
            const user = await this._userRepository.findOne({ filter: { _id: decoded.id, confirmed: true ,freazed: { $exists: false } } })
            if (!user) throw new BadRequestException("email is not confirmed or user is freazed")
            if (user?.timeChangePassword?.getTime()! > decoded?.iat! * 1000) throw new BadRequestException("token is revoked")

            return { decoded, user }
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}

