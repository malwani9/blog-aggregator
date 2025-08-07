import { deleteAllUsers } from "src/db/queries/users.js";

export async function handlerReset(cmdName: string, ...args: string[]): Promise<void> {
        await deleteAllUsers();
        console.log(`"${cmdName}": all users has been deleted successfully`);
}