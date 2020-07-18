import { User } from "../entities/user"
import config from '../config'
import UserDTO from "../dto/user.dto"
import bcrypt from "bcrypt";
import jwtBuilder from "jwt-builder";
import { RepositoryException } from "../exceptions/repositoryException";
import { Word } from "../entities/word";
import { Sequelize } from "sequelize";
import { Wordlist } from "../entities/wordlist";

export default {
    async getById(userId: number): Promise<UserDTO | null> {
        return await User.findByPk(userId, { raw: true }) as UserDTO
    },

    async register(name: string, country: string, email: string, password: string): Promise<UserDTO | null> {
        const encryptedPassword = await bcrypt.hash(password, 10)
        try {
            const newUser = await User.create({ name, country, email, encryptedPassword })
            return newUser.get({ plain: true }) as UserDTO
        } catch (error) {
            throw new RepositoryException(error)
        }
    },

    async getAllWords(ownerId: number): Promise<string[]> {
        const words = await Word.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('Word.name')), 'word_name']],
            order: [['name','ASC']],
            include: [
                {
                    model: Wordlist,
                    attributes: [],
                    where: { ownerId }
                }
            ],
            group:['word_name'],
            raw:true
        })

        // @ts-ignore
        return words.map(({word_name}) => word_name )
    },    

    async login(email: string, password: string): Promise<string | null> {
        const user = await User.findOne({ where: { email }, raw: true })
        if (!user) {
            throw 'user not found'
        }
        const doesMatch = await bcrypt.compare(password, user?.encryptedPassword!);
        if (doesMatch) {
            return jwtBuilder({
                algorithm: "HS256",
                secret: config.jwtSecretKey,
                iat: true,
                nbf: true,
                exp: config.jwtExpiration,
                iss: config.domain,
                userId: user.id,
                claims: {
                    role: "user"
                }
            });
        } else {
            throw "wrong password";
        }
    },

    async removeAccount(email: string){
        return User.destroy({where: {email}})
    }
}