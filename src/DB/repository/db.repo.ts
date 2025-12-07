import { DeleteResult } from "mongodb";
import { HydratedDocument, Model, ProjectionType, QueryOptions, RootFilterQuery, UpdateQuery, UpdateWriteOpResult } from "mongoose";



export abstract class DatabaseRepository<T> {
    constructor(protected _model: Model<T>) { }

    // findOne Repository
    async findOne({ filter, select, options = {} }: {
        filter: RootFilterQuery<T>,
        select?: ProjectionType<T>,
        options?: QueryOptions<T> | undefined,
    }
    ): Promise<HydratedDocument<T> | null> {
        return await this._model.findOne(filter, select, options)
    }
    // findAll Repository
    async findAll(filter: RootFilterQuery<T>, select?: ProjectionType<T>, options?: QueryOptions<T>
    ): Promise<HydratedDocument<T>[]> {
        return await this._model.find(filter, select, options)
    }
    // pagination Repository
    async paginatian({
        filter = {},
        select,
        options = {},
        page = 1,
        limit = 3,
    }: {
        filter?: RootFilterQuery<T>,
        select?: ProjectionType<T>,
        options?: QueryOptions<T> | undefined,
        page?: number,
        limit?: number,
    }
    ) {
        page = Math.floor(page < 1 ? 1 : page)
        options.limit = Math.floor(limit < 1 ? 1 : limit)
        options.skip = (page - 1) * limit

        const posts = await this._model.find(filter, select, options)
        const postCount = await this._model.countDocuments({})
        return { page, limit, postCount, posts }

    }
    // create Repository
    async create(filter: Partial<T>): Promise<HydratedDocument<T>> {
        return await this._model.create(filter)
    }
    // findOneAndUpdate Repository
    async findOneAndUpdate(filter: RootFilterQuery<T>, update: UpdateQuery<T>, Options: QueryOptions<T> = { new: true }): Promise<HydratedDocument<T> | null> {
        return await this._model.findOneAndUpdate(filter, update, Options)
    }
    // updateOne Repository
    async updateOne(filter: RootFilterQuery<T>, update: UpdateQuery<T>): Promise<UpdateWriteOpResult> {
        return await this._model.updateOne(filter, update)
    }
    // deleteMany Repository
    async deleteMany(filter: RootFilterQuery<T>): Promise<DeleteResult> {
        return await this._model.deleteMany(filter)
    }
    // deleteOne Repository
    async deleteOne(filter: RootFilterQuery<T>): Promise<DeleteResult> {
        return await this._model.deleteOne(filter)
    }
    // findOneAndDelete Repository
    async findOneAndDelete(filter: RootFilterQuery<T>): Promise<HydratedDocument<T> | null> {
        return await this._model.findOneAndDelete(filter)
    }

}