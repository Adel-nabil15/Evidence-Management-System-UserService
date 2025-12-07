import { DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand, ListObjectsV2Command, ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { BadRequestException, Injectable } from "@nestjs/common";
import { StorageType } from "../enums";
import { randomUUID } from "crypto";
import { createReadStream } from "fs";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class S3Service {
    private readonly s3Client: S3Client

    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
            }
        })
    }
    // ================= Upload file ================== 
    Uploadfile = async ({
        Bucket = process.env.AWS_BUCKET_NAME!,
        ACL = "private",
        path,
        file,
        fileType = StorageType.cloud,
    }: {
        Bucket?: string,
        ACL?: ObjectCannedACL,
        path: string,
        file: Express.Multer.File,
        fileType?: StorageType
    }): Promise<string> => {
        const command = new PutObjectCommand({
            Bucket,
            ACL,
            Key: `${process.env.APP_NAME}/${path}/${randomUUID()}_${file.originalname}`,
            Body: fileType === StorageType.cloud ? file.buffer : createReadStream(file.path),
            ContentType: file.mimetype,
        })

        await this.s3Client.send(command)
        if (!command?.input?.Key) {
            throw new BadRequestException("Error uploading file")
        }
        return command.input.Key
    }

    // ================= Upload Large file ================== 
    UploadLargeFile = async ({
        Bucket = process.env.AWS_BUCKET_NAME!,
        ACL = "private",
        path,
        file,
        fileType = StorageType.cloud,
    }: {
        Bucket?: string,
        ACL?: ObjectCannedACL,
        path: string,
        file: Express.Multer.File,
        fileType?: StorageType
    }): Promise<string> => {
        const parallelUploads3 = new Upload({
            client: this.s3Client,
            params: {
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key: `${process.env.APP_NAME}/${path}/${randomUUID()}_${file.originalname}`,
                Body: fileType === StorageType.cloud ? file.buffer : createReadStream(file.path),
                ContentType: file.mimetype,
            }
        })
        const { Key } = await parallelUploads3.done()
        if (!Key) {
            throw new BadRequestException("Error uploading file")
        }
        return Key

    }

    // ================= Upload Files ================== 
    UploadFiles = async ({
        Bucket = process.env.AWS_BUCKET_NAME!,
        ACL = "private",
        path,
        files,
        fileType = StorageType.cloud,
        isLargeFile = false
    }: {
        Bucket?: string,
        ACL?: ObjectCannedACL,
        path: string,
        files: Express.Multer.File[],
        fileType?: StorageType,
        isLargeFile?: boolean
    }): Promise<string[]> => {
        let keys: string[] = []

        if (isLargeFile === true) {
            keys = await Promise.all(files.map(file => this.UploadLargeFile({ Bucket, ACL, path, file, fileType })))
        } else {
            keys = await Promise.all(files.map(file => this.Uploadfile({ Bucket, ACL, path, file, fileType })))
        }

        return keys
    }


    // ================= Pre Signed Url ================== 
    creatPreSignedUrl = async (
        { Bucket = process.env.AWS_BUCKET_NAME!, ContentType, path, originalname, expiresIn = 30 }:
            { Bucket?: string, ContentType?: string, path?: string, originalname?: string, expiresIn?: number })
        : Promise<{ url: string, Key: string }> => {
        const Key = `${process.env.APP_NAME}/${path}/${randomUUID()}_${originalname}`
        const command = new PutObjectCommand({
            Bucket,
            Key,
            ContentType,
        })

        const url = await getSignedUrl(this.s3Client, command, { expiresIn })!
        return { url, Key }

    }

    // ================= Get File ================== 
    GetFile = async ({ Bucket = process.env.AWS_BUCKET_NAME!, Key }: { Bucket?: string, Key: string }) => {
        const commend = new GetObjectCommand({ Bucket, Key })
        return await this.s3Client.send(commend)
    }

    // ================= CreateGetFilePreSignedUrl ================== 
    CreateGetFilePreSignedUrl = async ({ Bucket = process.env.AWS_BUCKET_NAME!, Key, expiresIn = 60 }: { Bucket?: string, Key: string, expiresIn?: number }) => {
        
        const command = new GetObjectCommand({ Bucket, Key })
        const url = await getSignedUrl(this.s3Client, command, { expiresIn })!
        return url!
    }

    // ================ Delete File ================== 
    DeleteFile = async ({
        Bucket = process.env.AWS_BUCKET_NAME!,
        Key,
    }: {
        Bucket?: string,
        Key: string,
    }) => {
        const command = new DeleteObjectCommand({ Bucket, Key })
        await this.s3Client.send(command)
    }

    // ================ Delete Files ================== 
    DeleteFiles = async ({
        Bucket = process.env.AWS_BUCKET_NAME!,
        urls,
        Quiet = false,
    }: {
        Bucket?: string,
        urls: string[],
        Quiet?: boolean,
    }) => {

        const command = new DeleteObjectsCommand({
            Bucket,
            Delete: {
                Objects: urls.map(url => ({ Key: url })),
                Quiet,
            }
        })
        return await this.s3Client.send(command)
    }

    // ================ List Files ================== 
    ListFiles = async ({
        Bucket = process.env.AWS_BUCKET_NAME!,
        path,
    }: {
        Bucket?: string,
        path?: string,
    }) => {
        const command = new ListObjectsV2Command({
            Bucket,
            Prefix: `${process.env.APP_NAME}/${path}`
        })
        return await this.s3Client.send(command)
    }
}