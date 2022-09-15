import { hash } from "bcryptjs"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"


describe("authenticate user", () => {

    let inMemoryUsersRepository : InMemoryUsersRepository
    let authenticateUserUseCase : AuthenticateUserUseCase

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    })

    it("should be able to authenticate an user", async() => {
        inMemoryUsersRepository.create(
           {name: "userTest",
            email: "user@example.com",
            password: await hash("1234",8)})


        const result = await authenticateUserUseCase.execute({
            email:"user@example.com",
            password:"1234"
        })


        expect(result).toHaveProperty('token')
    })

    it("should not be able to authenticate a non-existent user", async() => {

        expect(authenticateUserUseCase.execute({
            email:"user@example.com",
            password:"1234"
        })) .rejects.toEqual(new IncorrectEmailOrPasswordError())
    })

    it("should not be able to authenticate an user with email wrong", async() => {
        inMemoryUsersRepository.create(
           {name: "userTest",
            email: "user@example.com",
            password: await hash("1234",8)})

        expect(authenticateUserUseCase.execute({email:"use@example.com",password:"1234"})).rejects.toEqual(new IncorrectEmailOrPasswordError())
    })


    it("should not be able to authenticate an user with password wrong", async() => {

        inMemoryUsersRepository.create(
           {name: "userTest",
            email: "user@example.com",
            password: await hash("1234",8)})

        expect(
            authenticateUserUseCase.execute({email:"user@example.com",password:"12345"}))
            .rejects.toEqual(new IncorrectEmailOrPasswordError())
    })


})