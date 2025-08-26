import { db } from "..";
import { feeds, NewPost, posts, users } from "../schema";
import { asc, eq } from "drizzle-orm";
import { firstOrUndefined } from "./utils";

export async function createPost(post: NewPost){
    const [result] = await db
        .insert(posts)
        .values(post).returning();
    return result;
}

export async function getPostsForUser(user_id: string, limit: number){
    const result = await db.select({
        postId: posts.id,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        title: posts.title,
        url: posts.url,
        description: posts.description,
        publishDate: posts.publishDate,
        feedId: posts.feed_id,
        userId: feeds.user_id,

    })
        .from(posts)
        .innerJoin(feeds, eq(feeds.id, posts.feed_id))
        .innerJoin(users, eq(users.id, feeds.user_id))
        .where(eq(users.id, user_id))
        .limit(limit)
        .orderBy(asc(posts.publishDate));

    return result;
}