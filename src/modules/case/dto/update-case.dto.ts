import { IsArray, IsEnum, IsOptional, IsString, IsBoolean, Length, IsMongoId } from "class-validator";
import { CasePriorityEnum, CaseStatusEnum } from "src/common/enums";


export class UpdateCaseDto {
    @IsString()
    @IsOptional()
    @Length(5, 100, { message: "Title must be between 5 and 100 characters" })
    title?: string;

    @IsString()
    @IsOptional()
    @Length(5, 500, { message: "Description must be between 5 and 500 characters" })
    description?: string;

    @IsEnum(CaseStatusEnum)
    @IsOptional()
    status?: CaseStatusEnum;

    @IsEnum(CasePriorityEnum)
    @IsOptional()
    priority?: CasePriorityEnum;

    @IsArray()
    @IsOptional()
    @IsMongoId({ each: true })
    involvedUsers?: string[];

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
