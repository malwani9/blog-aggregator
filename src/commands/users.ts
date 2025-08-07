import { getUsers } from "src/db/queries/users.js";
import { readConfig } from "src/config.js";

export async function handlerUsers(cmdName: string, ...args: string[]): Promise<void> {
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