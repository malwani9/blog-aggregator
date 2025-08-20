import { createUser, getUser, getUsers } from "src/db/queries/users.js";
import { readConfig, setUser } from "src/config.js";


export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <username>`);
    }

    const username = args[0];
    const user = await getUser(username);
    if (!user) {
        throw new Error(`login fail, username: ${username} does not exist!!!`);
    }

    setUser(username);
    console.log(`user: '${username}' switched successfully!`);
}

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

export async function handlerListUsers(_: string): Promise<void> {
    const config = readConfig();
    const users = await getUsers();
    for (const user of users) {
        if (user.name === config.currentUserName) {
            console.log(`* ${user.name} (current)`);
        }else {
            console.log(`* ${user.name}`);
        }
    }
}