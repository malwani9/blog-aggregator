import { db } from "..";
import { feed_follows, feeds, users } from "../schema";
import { eq } from "drizzle-orm";
import { firstOrUndefined } from "./utils";

export async function createFeed(name: string, url: string, user_id: string){
    const [result] = await db.insert(feeds).values({ name: name, url: url, user_id: user_id }).returning();
    return result;
}

export async function getFeeds(){
    const result = await db.select().from(feeds);
    return result;
}

export async function getFeedByURL(url: string) {
    const result = await db.select().from(feeds).where(eq(feeds.url, url));
    return firstOrUndefined(result);
}

export async function getFeedById(id: string) {
    const result = await db.select().from(feeds).where(eq(feeds.id, id));
    return firstOrUndefined(result);
}

export async function creatFeedFollow(user_id: string, feed_id: string) {
    const [newFeedFollow] = await db.insert(feed_follows).values({user_id, feed_id});
    const feed_follow = await db.select({
        feedFollowId: feed_follows.id,
        createdAt: feed_follows.createdAt,
        updatedAt: feed_follows.updatedAt,
        userName: users.name,
        feedName: feeds.name})
        .from(feed_follows)
        .innerJoin(users, eq(users.id, user_id))
        .innerJoin(feeds, eq(feeds.id, feed_id));

    return firstOrUndefined(feed_follow);
}

export async function getFollowedFeedsByUserId(user_id: string){
    const result = await db.select({
        feedFollowId: feed_follows.id,
        feedId: feed_follows.feed_id,
        feedFollowUserID: feed_follows.user_id,
    })
        .from(feed_follows)
        .where(eq(feed_follows.user_id, user_id));
    return result;
}