import { IsEnum, IsOptional, IsString, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { CasePriorityEnum, CaseStatusEnum } from "src/common/enums";


export class GetCasesQueryDto {
    @IsOptional()
    @Type(() => Number)
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @IsEnum(CaseStatusEnum)
    @IsOptional()
    status?: CaseStatusEnum;

    @IsEnum(CasePriorityEnum)
    @IsOptional()
    priority?: CasePriorityEnum;

    @IsString()
    @IsOptional()
    createdBy?: string;

    @IsOptional()
    @IsString()
    isActive?: string; // "true" | "false" from query
}
