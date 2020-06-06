import Database from "../db";
import { User } from "../user";

let database: Database;

beforeEach(async () => {
    database = new Database()
    database.connect('sqlite::memory:')
    await database.createDatabase()
})

afterEach(async () => {
    await database.disconnect()
})

test("shouldn't accept a invalid email", async () => {
    await expect(User.create({ email: 'Invalid email', name: 'lucas', country: 'BR', encryptedPassword: '123' })).rejects.toThrow('Validation error');
})

test("should accept a valid email", async () => {
    await expect(User.create({ email: 'xpto@gmail.com', name: 'lucas', country: 'BR', encryptedPassword: '123' })).resolves.toBeInstanceOf(User)
    await expect(User.create({ email: 'xyz@bol.com.br', name: 'lucas', country: 'BR', encryptedPassword: '123' })).resolves.toBeInstanceOf(User)
})

test("the email field should be unique", async () => {
    await expect(User.create({ email: 'xpto1@gmail.com', name: 'lucas', country: 'BR', encryptedPassword: '123' })).resolves.toBeInstanceOf(User)
    await expect(User.create({ email: 'xpto1@gmail.com', name: 'lucas2', country: 'BR', encryptedPassword: '123' })).rejects.toThrow('Validation error')
})