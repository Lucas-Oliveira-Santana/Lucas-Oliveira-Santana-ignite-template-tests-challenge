import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import {OperationType} from '../../entities/Statement';


describe(("gat balance"),()=>{

    let inMemoryStatementsRepository : InMemoryStatementsRepository;
    let getBalance : GetBalanceUseCase
    let usersRepositoryInMemory : InMemoryUsersRepository


    beforeEach(()=>{
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        usersRepositoryInMemory = new InMemoryUsersRepository()
        getBalance = new GetBalanceUseCase(inMemoryStatementsRepository,usersRepositoryInMemory)
    })

    it("should be able to list all statement of an user", async()=>{
        const user = await usersRepositoryInMemory.create({
            name: "userTest",
            email: "user@example.com",
            password: "1234"
        })

        const deposit = await inMemoryStatementsRepository.create({
            user_id: user.id as string,
            description: 'deposit statement test',
            type: OperationType.DEPOSIT,
            amount: 120,
          });

          const withdraw = await inMemoryStatementsRepository.create({
            user_id: user.id as string,
            description: 'withdraw statement test',
            type: OperationType.WITHDRAW,
            amount: 90.
          });
      
          const balance = await getBalance.execute({
            user_id: user.id as string,
          });
      
          expect(balance).toStrictEqual({
            statement: [deposit, withdraw],
            balance: 30,
    })})
})