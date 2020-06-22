import { FindOptions, Op, WhereAttributeHash, Includeable, ProjectionAlias } from "sequelize";
import { User } from "../entities/user";
import { Word } from "../entities/word";
import sequelize from "sequelize";

export class WordlistQueryBuilder {
    private _filter: WhereAttributeHash = {}
    private _options: FindOptions = {}
    private include: Includeable[] | undefined
    private additionalAttrs: { include: [ProjectionAlias] } | undefined
    private isIncludingWords = false
    private isIncludingWordsCount = false


    public build(): FindOptions {
        return { ...this._options, attributes: this.additionalAttrs, where: { ...this._filter }, include: this.include }
    }

    public includeWordsCount() {
        if (this.isIncludingWords) {
            throw new Error("Either include words or wordsCount. Both are not supported");
        }

        this.include = [{ model: Word, attributes: [] }]
        this.additionalAttrs = {
            include: [
                [sequelize.fn('COUNT', sequelize.col('words.id')), 'wordsCount']
            ]
        }
        this.isIncludingWordsCount=true
        return this
    }

    public includeWords() {
        if (this.isIncludingWordsCount) {
            throw new Error("Either include words or wordsCount. Both are not supported");
        }        
        this.isIncludingWords =true
        this.include = [{ model: Word, order: [[Word, 'name', 'ASC']] }]
        return this
    }
    public id(id: number) {
        this._filter['id'] = id
        return this
    }

    public owner(owner: User) {
        return this.ownerId(owner?.id)
    }

    public ownerId(ownerId?: number) {
        if (ownerId) {
            this._filter['ownerId'] = ownerId
        }
        return this
    }

    public private(value: boolean) {
        this._filter['isPrivate'] = value
        return this
    }

    public notOwnedBy(owner: User) {
        if (owner.id) {
            this._filter['ownerId'] = { [Op.ne]: owner.id }
        }
        return this
    }

    /**
     * pageSize
     * page {number} starting from 0
     */
    public paginate(pageSize: number, page: number) {
        this._options.offset = page > 0 ? page * pageSize : 0;
        this._options.limit = pageSize
        return this
    }

    /**
     * orderedByIdDesc
     */
    public orderedByIdDesc() {
        this._options['order'] = [['id', 'DESC']]
        return this;
    }

    public nameIlike(name: string) {
        const operator = (process.env.NODE_ENV === 'test') ? Op.like : Op.iLike
        this._filter['name'] = { [operator]: `%${name}%` }
        return this
    }
}