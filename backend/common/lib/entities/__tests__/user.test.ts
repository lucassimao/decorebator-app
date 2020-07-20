import Database from "../../db";
import { User } from "../user";
import { Wordlist } from "../wordlist";
import { UserRepository } from "../..";


beforeEach(async () => {
    await Database.connect('sqlite::memory:')
})

afterEach(async () => {
    await Database.instance.disconnect()
})

test('should not accept a invalid country code',async ()=> {
    await expect(User.create({ email: 'abc@gmail.com', name: 'lucas', country: 'inexisting', encryptedPassword: '123' })).rejects.toThrow('Validation error');
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

test('should be able to bring all user words from all wordlists', async() => {
    const user = await User.create({name:'Lucas',email: 'xpto@gmail.com',country: 'BR', encryptedPassword: '123'})
    const wordlist1 = await Wordlist.create({
        isPrivate: true,
        description: 'xpto',
        language: 'pt-BR',
        name: 'wordlist 123',
        avatarColor: '#fff',
        ownerId: user.id
    });
    await wordlist1.createWord({name: 'Word 1'})
    await wordlist1.createWord({name: 'Word 2'})
    await wordlist1.createWord({name: 'Word 3'})

    const wordlist2 = await Wordlist.create({
        isPrivate: true,
        description: 'xpto2',
        language: 'pt-BR',
        name: 'wordlist 12345',
        avatarColor: '#fff',
        ownerId: user.id
    });    

    await wordlist2.createWord({name: 'Word 1'})
    await wordlist2.createWord({name: 'Word 2'})
    await wordlist2.createWord({name: 'Word 3'})  
    await wordlist2.createWord({name: 'Word 4'})    
    await wordlist2.createWord({name: 'Word 5'})    

    const allWords = await UserRepository.getAllWords(user.id!)
    expect(allWords).toEqual(['Word 1','Word 2','Word 3', 'Word 4', 'Word 5'])

})

test('should be able to retrieve all wordlists using getWordlists', async()=>{
    const user = await User.create({name:'Lucas',email: 'xpto@gmail.com',country: 'BR', encryptedPassword: '123'})
    const user2 = await User.create({name:'another user',email: 'xpto2@gmail.com',country: 'BR', encryptedPassword: '123'})

    const wordlist1 = await Wordlist.create({
        isPrivate: true,
        description: 'xpto',
        language: 'pt-BR',
        name: 'wordlist 123',
        avatarColor: '#fff',
        ownerId: user.id
    });

    const userWordlists = await user.getWordlists()
    expect(userWordlists).toHaveLength(1)
    expect(userWordlists[0].id).toEqual(wordlist1.id)
    
    expect(await user2.getWordlists()).toHaveLength(0)
})