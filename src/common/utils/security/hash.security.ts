import { compare, hash } from "bcrypt";

export const HASH = async (
    plainText: string,
    saltOrRounds: number = Number(process.env.SALT)): Promise<string> => {
    return await hash(plainText, saltOrRounds)
}

export const COMPARE = async (plainText: string, hashText: string): Promise<boolean> => {
    return await compare(plainText, hashText)
}