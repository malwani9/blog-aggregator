import { error } from "console";
import { readConfig } from "src/config";
import { createFeed, creatFeedFollow, getFeedById, getFeedByURL, getFollowedFeedsByUserId, getFeeds } from "src/db/queries/feeds";
import { getUser, getUserById } from "src/db/queries/users.js";
import { Feed, feeds, User, users } from "src/db/schema";

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
    const feedFollow = await creatFeedFollow(user_id, feed.id);
    console.log("Feed created and followed successfully: ")
    console.log("----------------------------")
    printFeed(feed, currentUser);

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

export async function handlerFollowFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }

    const feedURL = args[0]
    const feed = await getFeedByURL(feedURL);
    if (!feed) {
        throw new Error(`Feed ${feedURL} not found`);
    }

    const feed_id = feed.id; 
    const user_id = feed.user_id

    const feed_follow = await creatFeedFollow(user_id, feed_id);
    if (!feed_follow) { 
       throw new Error("Failed to create feed follow");
    }

    console.log(`user: ${feed_follow.userName} start following ${feed_follow.feedName} feed`);
}


export async function handlergetFollowedFeedsForUser(_: string) {
    const config = readConfig();
    const currentUser = await getUser(config.currentUserName);
    if (!currentUser) {
        throw new Error(`User ${currentUser} not found`);
    }

    const followedFeeds = await getFollowedFeedsByUserId(currentUser.id);

    if(followedFeeds.length === 0) {
        throw new Error(`No feeds found for user: ${currentUser.name}`);
    }

    for (const followedFeed of followedFeeds){
        const feed = await getFeedById(followedFeed.feedId);
        if (!feed) {
            throw new Error("Feed not found");
        }
        console.log(feed.name);
    }
}
