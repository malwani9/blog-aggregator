import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export async function createUser(name: string){
    const userExist = await getUser(name);
    if (userExist.length > 0) {
        console.log(`${name} already exist!!!`);
        process.exit(1)
    }
    const [result] = await db.insert(users).values({ name: name }).returning();
    return result;
}

export async function getUser(name: string){
    const result = await db.select().from(users).where(eq(users.name, name));
    return result;
}