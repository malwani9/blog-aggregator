import { setUser } from "src/config";
import { createUser, getUser } from "src/db/queries/users";

export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error(`Error: Provide valid user name to register, hint: ${cmdName} <username> `);
    }

    const username = args[0];
    try{ 
        const result = await createUser(username);
        setUser(username);
        console.log(`user: '${username}' created and switched successfully!`);
    } catch (err){
        console.log("insert failed", err);
    }
}