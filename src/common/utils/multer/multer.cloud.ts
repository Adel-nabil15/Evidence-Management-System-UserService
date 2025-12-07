import { BadRequestException } from "@nestjs/common";
import { Request } from "express";
import multer from "multer"
import { FileFilterCallback } from "multer";
import os from "os";
import { StorageType } from "src/common";
import { randomUUID } from "crypto";




export const MulterCloud = (
    {
        fileType,
        storageType = StorageType.cloud,
    }: {
        fileType: string[],
        storageType?: StorageType,
    }
) => {
    return {
        storage: storageType === StorageType.cloud ? multer.memoryStorage() : multer.diskStorage({
            destination: os.tmpdir(),
            filename: (req: Request, file: Express.Multer.File, cb: Function) => {
                console.log("📦 File received:", file.originalname);
                cb(null,randomUUID() + "-" + file.originalname);
            }
        }),

        fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
            if (fileType.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new BadRequestException("Invalid file type"));
            }
        }
    }
};