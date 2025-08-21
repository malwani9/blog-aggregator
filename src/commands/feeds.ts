import { readConfig } from "src/config";
import { creatFeedFollow } from "src/db/queries/feed_follows";
import { createFeed, getFeeds } from "src/db/queries/feeds";
import { getUser, getUserById } from "src/db/queries/users.js";
import { Feed, User } from "src/db/schema";
import { printFeedFollow } from "./feed_follows";

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

    console.log("Feed created successfully: ");
    console.log("----------------------------");
    printFeed(feed, currentUser);

    const feedFollow = await creatFeedFollow(user_id, feed.id);
    console.log("Feed Followed: ");
    console.log("----------------------------");
    printFeedFollow(feedFollow.userName, feedFollow.feedName);

}

function printFeed(feed: Feed, user: User) {
    console.log(`* ID:       ${feed.id}`);
    console.log(`* Created:  ${feed.createdAt}`);
    console.log(`* Updated:  ${feed.updatedAt}`);
    console.log(`* Name:     ${feed.name}`);
    console.log(`* URL:      ${feed.url}`);
    console.log(`* User:     ${user.name}`);
} 

export async function handlerListFeeds(_:string) {
    const feeds = await getFeeds();
    if (feeds.length === 0) {
        console.log("No feeds found.");
        return;
    }
    for (const feed of feeds) {
        const user = await getUserById(feed.user_id);
        if (!user) {
            throw new Error(`No user found for this feed: ID: ${feed.id}, NAME: ${feed.name}`)
        } 

        printFeed(feed, user);
        console.log("-------------------------");
    }
}
