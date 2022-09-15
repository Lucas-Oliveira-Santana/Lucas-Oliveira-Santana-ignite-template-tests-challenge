import {InMemoryUsersRepository} from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"
import { ICreateUserDTO } from "./ICreateUserDTO";


describe("should be able to create a User",()=>{
    let usersRepositoryInMemory : InMemoryUsersRepository
    let createUserUseCase: CreateUserUseCase

    beforeEach(()=>{
        usersRepositoryInMemory = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    })

    it("should create a new User",async()=>{
        const user = await createUserUseCase.execute({ 
            name: "userTest",
            email: "user@example.com",
            password: "1234"
            })

        expect(user).toHaveProperty("id")
    })

    it("should not be able create a user exists",async()=>{

        const userData: ICreateUserDTO = {
            name: "userTestExist",
            email: "userTestExist@example.com",
            password: "1234"
        }
        
        await createUserUseCase.execute(userData)

        await expect(createUserUseCase.execute(userData)).rejects.toEqual( new CreateUserError() )

    })
})