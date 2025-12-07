import jwt, { JwtPayload } from "jsonwebtoken";




export const GTOKEN = async ({ paylod, privatekey, options }: {
    paylod: object,
    privatekey: string,
    options: jwt.SignOptions
}): Promise<string> => {
    return jwt.sign(paylod, privatekey, options)
}


export const VTOCEN = async ({ token, privatekey }: {
    token: string,
    privatekey: string
}): Promise<JwtPayload> => {
    return jwt.verify(token, privatekey) as JwtPayload
}