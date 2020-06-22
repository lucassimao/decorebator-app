import WordDTO from "./word.dto";

export default interface WordlistDTO{
    id?: number
    name: string
    isPrivate?:boolean
    description?: string
    language?:string
    avatarColor?:string
    createdAt?:string
    ownerId?: number
    words? : [WordDTO]
    wordsCount?: number
}