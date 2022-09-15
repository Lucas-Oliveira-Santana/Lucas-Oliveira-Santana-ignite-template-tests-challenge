import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"


let inMemoryUsersRepository: InMemoryUsersRepository
let showUserProfile : ShowUserProfileUseCase
let createUserUseCase : CreateUserUseCase

describe(("should be able to see user"),()=>{

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        showUserProfile = new ShowUserProfileUseCase(inMemoryUsersRepository)
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)

    })



    it("should be able to see user", async()=>{

        const createUser = await createUserUseCase.execute({ 
            name: "userTest",
            email: "user@example.com",
            password: "1234"
            })

        const userEmail = await inMemoryUsersRepository.findByEmail(createUser.email)
        
        let user_id = userEmail?.id

        if(!user_id){
            user_id = "id not valid"
        }

        const user = await showUserProfile.execute(user_id)

        expect(user).toHaveProperty("id")
        expect(user.email).toEqual(createUser.email)
    })


    it("should be able list an non-existent user", async()=>{
        await expect(async () => {
            await showUserProfile.execute(`id isn't valid`)
          }).rejects.toBeInstanceOf(ShowUserProfileError);
    })

} 
)