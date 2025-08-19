import { readConfig } from "src/db/queries/config";
import { createFeed } from "src/db/queries/feeds";
import { getUser } from "src/db/queries/users.js";
import { feeds, users } from "src/db/schema";

export async function handlerAddFeed(cmdName: string, ...args: string[]): Promise<void> {
        
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <name> <url>`);
    }
    
        
    const config = readConfig();
    const currentUser = await getUser(config.currentUserName);
    if (!currentUser) {
        throw new Error(`User ${currentUser} not found`);
    }
    const user_id = currentUser.id
    const feedName = args[0];
    const feedURL = args[1];

    const feed = await createFeed(feedName, feedURL, user_id);
    if (!feed) {
        throw new Error("Failed to create feed");
    }
    console.log("Feed created successfully: ")
    console.log("----------------------------")
    printFeed(feed, currentUser);

}

function printFeed(feed: Feed, user: User) {
    console.log(`* ID:       ${feed.id}`);
    console.log(`* Created:  ${feed.createdAt}`);
    console.log(`* Updated:  ${feed.updatedAt}`);
    console.log(`* Name:     ${feed.name}`);
    console.log(`* URL:      ${feed.url}`);
    console.log(`* User:       ${user.name}`);
} 

export type Feed = typeof feeds.$inferSelect;
export type User = typeof users.$inferSelect;