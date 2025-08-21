import { readConfig } from "src/config";
import { creatFeedFollow, getFollowedFeedsByUserId } from "src/db/queries/feed_follows";
import { getFeedByURL } from "src/db/queries/feeds";
import { getUser } from "src/db/queries/users";

export async function handlerFollowFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }

    const feedURL = args[0]
    const feed = await getFeedByURL(feedURL);
    if (!feed) {
        throw new Error(`Feed ${feedURL} not found`);
    }

    const config = readConfig();
    const currentUser = await getUser(config.currentUserName);
    if (!currentUser) {
        throw new Error(`User ${currentUser} not found`);
    }

    const feed_id = feed.id; 
    const user_id = currentUser.id

    const feed_follow = await creatFeedFollow(user_id, feed_id);
    if (!feed_follow) { 
       throw new Error("Failed to create feed follow");
    }

    printFeedFollow(currentUser.name, feed.name);
}


export async function handlergetFollowedFeedsForUser(_: string) {
    const config = readConfig();
    const currentUser = await getUser(config.currentUserName);
    if (!currentUser) {
        throw new Error(`User '${currentUser}' not found`);
    }

    const followedFeeds = await getFollowedFeedsByUserId(currentUser.id);

    if(followedFeeds.length === 0) {
        throw new Error(`No feeds found for user: ${currentUser.name}`);
    }

    console.log(`Feed follows for user "${currentUser.name}": `)
    for (const followedFeed of followedFeeds){
        console.log(` * ${followedFeed.feedName}`);
    }
}

export function printFeedFollow(username: string, feedname: string) {
    console.log(`new feed follow created: `);
    console.log(`user name:  ${username}`);
    console.log(`feed name:  ${feedname}`);
}