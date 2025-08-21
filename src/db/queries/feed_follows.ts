import { db } from "..";
import { feed_follows, feeds, users } from "../schema";
import { eq, and } from "drizzle-orm";


export async function creatFeedFollow(user_id: string, feed_id: string) {
    const [newFeedFollow] = await db.insert(feed_follows).values({user_id, feed_id}).returning();

    const [feed_follow] = await db.select({
        feedFollowId: feed_follows.id,
        createdAt: feed_follows.createdAt,
        updatedAt: feed_follows.updatedAt,
        userName: users.name,
        feedName: feeds.name
    })
        .from(feed_follows)
        .innerJoin(feeds, eq(feeds.id, feed_id))
        .innerJoin(users, eq(users.id, user_id))
        .where(
            and(
                eq(feed_follows.id, newFeedFollow.id),
                eq(users.id, newFeedFollow.user_id)
            ),
        );

    return feed_follow;
}

export async function getFollowedFeedsByUserId(user_id: string){
    const result = await db.select({
        feedFollowId: feed_follows.id,
        createdAt: feed_follows.createdAt,
        updatedAt: feed_follows.updatedAt,
        feedId: feed_follows.feed_id,
        feedName: feeds.name,
    })
        .from(feed_follows)
        .innerJoin(feeds, eq(feeds.id, feed_follows.feed_id))
        .where(eq(feed_follows.user_id, user_id));

    return result;
}