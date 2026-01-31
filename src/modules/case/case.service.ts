import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CasePriorityEnum, CaseStatusEnum, RoleEnum } from "src/common";
import { CaseRepository, HydratedCaseDocument } from "src/DB";
import type { HydratedUserDocument } from "src/DB";
import { CreateCaseDto } from "./dto/create-case.dto";
import { UpdateCaseDto } from "./dto/update-case.dto";
import { GetCasesQueryDto } from "./dto/get-cases-query.dto";


@Injectable()
export class CaseService {
    constructor(private readonly _caseRepository: CaseRepository) { }

    // ======================= Create Case =======================
    async create_S(dto: CreateCaseDto, createdBy: string) {
        const payload = {
            title: dto.title,
            description: dto.description,
            status: dto.status ?? CaseStatusEnum.New,
            priority: dto.priority ?? CasePriorityEnum.High,
            createdBy,
            involvedUsers: dto.involvedUsers ?? [],
            isActive: true,
        };
        const caseEntity = await this._caseRepository.create(payload);
        return caseEntity;
    }

    // ======================= Get All Cases (with pagination & filters) =======================
    async findAll_S(query: GetCasesQueryDto) {
        const filter: Record<string, unknown> = {};
        if (query.status) filter.status = query.status;
        if (query.priority) filter.priority = query.priority;
        if (query.createdBy) filter.createdBy = query.createdBy;
        if (query.isActive !== undefined) {
            filter.isActive = query.isActive === "true";
        }

        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const result = await this._caseRepository.paginatian({
            filter: filter as never,
            page,
            limit,
            options: { sort: { createdAt: -1 } },
        });
        return {
            ...result,
            totalPages: Math.ceil(result.postCount / limit),
        };
    }

    // ======================= Get Case By Id =======================
    async findOne_S(id: string) {
        const caseEntity = await this._caseRepository.findOne({ filter: { _id: id } as never });
        if (!caseEntity) throw new NotFoundException("Case not found");
        return caseEntity;
    }

    // ======================= Update Case =======================
    async update_S(id: string, dto: UpdateCaseDto, user: HydratedUserDocument) {
        const caseEntity = await this.findOne_S(id);
        this._assertCanModifyCase(caseEntity, user);
        const updatePayload: Record<string, unknown> = {};
        Object.entries(dto).forEach(([key, value]) => {
            if (value !== undefined) updatePayload[key] = value;
        });
        if (Object.keys(updatePayload).length === 0) return caseEntity;
        const updated = await this._caseRepository.findOneAndUpdate(
            { _id: id } as never,
            { $set: updatePayload },
            { new: true }
        );
        if (!updated) throw new NotFoundException("Case not found");
        return updated;
    }

    // ======================= Delete Case =======================
    async delete_S(id: string, user: HydratedUserDocument) {
        const caseEntity = await this.findOne_S(id);
        this._assertCanModifyCase(caseEntity, user);
        await this._caseRepository.deleteOne({ _id: id } as never);
        return { message: "Case deleted successfully" };
    }

    // ======================= Freeze Case =======================
    async freeze_S(id: string, user: HydratedUserDocument) {
        if (user.role !== RoleEnum.admin) throw new BadRequestException("Only admin can freeze a case");
        const caseEntity = await this.findOne_S(id);
        if (caseEntity.freazed) throw new BadRequestException("Case is already frozen");
        await this._caseRepository.findOneAndUpdate(
            { _id: id } as never,
            { $set: { freazed: true, freezedBy: user._id.toString() } },
            { new: true }
        );
        return { message: "Case frozen successfully" };
    }

    // ======================= Unfreeze Case =======================
    async unfreeze_S(id: string, user: HydratedUserDocument) {
        if (user.role !== RoleEnum.admin) throw new BadRequestException("Only admin can unfreeze a case");
        const caseEntity = await this.findOne_S(id);
        if (!caseEntity.freazed) throw new BadRequestException("Case is not frozen");
        await this._caseRepository.findOneAndUpdate(
            { _id: id } as never,
            { $unset: { freazed: 1, freezedBy: 1 } },
            { new: true }
        );
        return { message: "Case unfrozen successfully" };
    }

    private _assertCanModifyCase(caseEntity: HydratedCaseDocument, user: HydratedUserDocument) {
        if (caseEntity.freazed) throw new BadRequestException("Cannot modify a frozen case");
        const isAdmin = user.role === RoleEnum.admin;
        const isCreator = caseEntity.createdBy === user._id.toString();
        if (!isAdmin && !isCreator) {
            throw new BadRequestException("You do not have permission to modify this case");
        }
    }
}
