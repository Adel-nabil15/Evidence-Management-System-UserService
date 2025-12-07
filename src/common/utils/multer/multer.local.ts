import multer from "multer"
import { BadRequestException } from "@nestjs/common";
import { Request } from "express";


export const MulterLocal = ({ fileTypes = [] }: { fileTypes?: string[] } = {}) => {
    return {
        storage: multer.diskStorage({
            destination: (req: Request, file: Express.Multer.File, cb: Function) => {
                cb(null, "./uploads")
            },
            filename: (req: Request, file: Express.Multer.File, cb: Function) => {
                const prefix = `${Date.now()}-${Math.round(Math.random() * 1000000)}`
                cb(null, `${prefix}-${file.originalname}`)
            }
        }),
        fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
            if (fileTypes.includes(file.mimetype)) {
                cb(null, true)
            } else {
                cb(new BadRequestException("File type not supported"), false)
            }
        },
        limits: {
            fileSize: 1024 * 1024 * 5 // 5MB
        }
    }

}