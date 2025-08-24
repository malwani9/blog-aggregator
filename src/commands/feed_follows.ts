import { creatFeedFollow, deleteFeedFollow, getFollowedFeedsByUserId } from "src/db/queries/feed_follows";
import { getFeedByURL } from "src/db/queries/feeds";
import { User } from "src/db/schema";

export async function handlerFollowFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }

    const feedURL = args[0]
    const feed = await getFeedByURL(feedURL);
    if (!feed) {
        throw new Error(`Feed ${feedURL} not found`);
    }


    const feed_id = feed.id; 
    const user_id = user.id

    const feed_follow = await creatFeedFollow(user_id, feed_id);
    if (!feed_follow) { 
       throw new Error("Failed to create feed follow");
    }

    printFeedFollow(user.name, feed.name);
}

export async function handlerUnFollowFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }

    const feedURL = args[0]
    const feed = await getFeedByURL(feedURL);
    if (!feed) {
        throw new Error(`Feed <${feedURL}> not found`);
    }

    const feed_id = feed.id;
    const user_id = user.id;

    const deletedFeedFollow = await deleteFeedFollow(user_id, feed_id);
    if (!deletedFeedFollow) {
        throw new Error(`Failed unfollow feed: <${feedURL}>`);
    }
    console.log("Feed unfollowed Successfully! : ");
    console.log(`user :        ${user.name}`);
    console.log(`feed name:    ${feed.name}`);
    console.log(`feed url:     ${feedURL}`);
}


export async function handlergetFollowedFeedsForUser(cmdName: string, user: User, ...args: string[]) {
    if (!user) {
        throw new Error(`User '${user}' not found`);
    }

    const followedFeeds = await getFollowedFeedsByUserId(user.id);

    if(followedFeeds.length === 0) {
        console.log(`No feeds found for user: ${user.name}`);
        return;
    }

    console.log(`Feed follows for user "${user.name}": `)
    for (const followedFeed of followedFeeds){
        console.log(` * ${followedFeed.feedName}`);
    }
}

export function printFeedFollow(username: string, feedname: string) {
    console.log(`new feed follow created: `);
    console.log(`user name:  ${username}`);
    console.log(`feed name:  ${feedname}`);
}