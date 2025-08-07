import { getUser } from "src/db/queries/users.js";
import { setUser } from "../config.js";

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <username>`);
    }

    const username = args[0];
    const user = await getUser(username);
    if (user.length === 0) {
        throw new Error(`login fail, username: ${username} does not exist!!!`);
    }

    setUser(username);
    console.log(`user: '${username}' switched successfully!`);
}