import ImageDTO from "./image.dto";

export default interface WordDTO{
    id?: number
    name?: string
    wordlistId?: number
    images?: ImageDTO[]
}