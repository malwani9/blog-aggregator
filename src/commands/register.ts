import { setUser } from "src/config";
import { createUser} from "src/db/queries/users";

export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error(`Error: Provide valid user name to register, hint: ${cmdName} <username> `);
    }

    const username = args[0];

    const user = await createUser(username);
    if (!user) {
        throw new Error(`User ${username} not found`);
    }

    setUser(user.name);
    console.log(`user: '${username}' created and switched successfully!`);

}