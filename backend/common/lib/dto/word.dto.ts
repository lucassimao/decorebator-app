import ImageDTO from "./image.dto";

export default interface WordDTO{
    id?: number
    name?: string
    createdAt?: string
    wordlistId?: number
    images?: ImageDTO[]
}