import { User } from "../entities/user"
import UserDTO from "../dto/user.dto"

export default {
    async getById(userId: number): Promise<UserDTO|null>{
        return await User.findByPk(userId,{raw: true}) as UserDTO
    }
}