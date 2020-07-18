import { ValidationError, DatabaseError, BaseError } from "sequelize"

export interface ValidationErrorItem {
    readonly  message: string;
    readonly  type: string;
    /** The field that triggered the validation error */
    readonly  path: string;
    /** The value that generated the error */
    readonly  value: string;
}

export class RepositoryException extends Error{

    constructor(private _reason: BaseError){
        super(_reason.message)
    }

    
    public get reason() : any {
        return this._reason
    }

    public get validationErrors() : ValidationErrorItem[] | undefined {
        if (this._reason instanceof ValidationError){
            return this._reason.errors.map( ({message,type,path,value}) => ({message,type,path,value}))
        }
    }

    
    public get isValidationError() : boolean {
        return this._reason instanceof ValidationError
    }
    
    public get isDatabaseError() : boolean {
        return this._reason instanceof DatabaseError
    }

}