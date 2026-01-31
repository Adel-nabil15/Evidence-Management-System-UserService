import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { Auth } from "src/common/decorator/auth.decorator";
import { CurrentUser } from "src/common/decorator/current-user.decorator";
import { RoleEnum, TokenTypeEnum } from "src/common";
import type { HydratedUserDocument } from "src/DB";
import { CaseService } from "./case.service";
import { CreateCaseDto } from "./dto/create-case.dto";
import { UpdateCaseDto } from "./dto/update-case.dto";
import { GetCasesQueryDto } from "./dto/get-cases-query.dto";


@Controller("api/case")
export class CaseController {
    constructor(private readonly _caseService: CaseService) { }

    // ============================ Create Case ============================
    @Post()
    @Auth({
        type: TokenTypeEnum.accesstoken,
        userRole: [RoleEnum.user, RoleEnum.admin]
    })
    create(@Body() dto: CreateCaseDto, @CurrentUser() user: HydratedUserDocument) {
        return this._caseService.create_S(dto, user._id.toString());
    }

    // ============================ Get All Cases (with pagination & filters) ============================
    @Get()
    @Auth({
        type: TokenTypeEnum.accesstoken,
        userRole: [RoleEnum.user, RoleEnum.admin]
    })
    findAll(@Query() query: GetCasesQueryDto) {
        return this._caseService.findAll_S(query);
    }

    // ============================ Get Case By Id ============================
    @Get(":id")
    @Auth({
        type: TokenTypeEnum.accesstoken,
        userRole: [RoleEnum.user, RoleEnum.admin]
    })
    findOne(@Param("id") id: string) {
        return this._caseService.findOne_S(id);
    }

    // ============================ Update Case ============================
    @Patch(":id")
    @Auth({
        type: TokenTypeEnum.accesstoken,
        userRole: [RoleEnum.user, RoleEnum.admin]
    })
    update(
        @Param("id") id: string,
        @Body() dto: UpdateCaseDto,
        @CurrentUser() user: HydratedUserDocument
    ) {
        return this._caseService.update_S(id, dto, user);
    }

    // ============================ Delete Case ============================
    @Delete(":id")
    @Auth({
        type: TokenTypeEnum.accesstoken,
        userRole: [RoleEnum.user, RoleEnum.admin]
    })
    delete(@Param("id") id: string, @CurrentUser() user: HydratedUserDocument) {
        return this._caseService.delete_S(id, user);
    }

    // ============================ Freeze Case ============================
    @Patch(":id/freeze")
    @Auth({
        type: TokenTypeEnum.accesstoken,
        userRole: [RoleEnum.admin]
    })
    freeze(@Param("id") id: string, @CurrentUser() user: HydratedUserDocument) {
        return this._caseService.freeze_S(id, user);
    }

    // ============================ Unfreeze Case ============================
    @Patch(":id/unfreeze")
    @Auth({
        type: TokenTypeEnum.accesstoken,
        userRole: [RoleEnum.admin]
    })
    unfreeze(@Param("id") id: string, @CurrentUser() user: HydratedUserDocument) {
        return this._caseService.unfreeze_S(id, user);
    }
}
