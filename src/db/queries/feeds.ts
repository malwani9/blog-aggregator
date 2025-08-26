import { db } from "..";
import { feeds } from "../schema";
import { eq, sql } from "drizzle-orm";
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

export async function markFeedFetched(feedId: string) {
    const result = await db
        .update(feeds)
        .set({ last_fetched_at: new Date()})
        .where(eq(feeds.id, feedId))
        .returning();

    return firstOrUndefined(result);
}

export async function getNextFeedToFetch() {
    const result = await db
        .select()
        .from(feeds)
        .orderBy(sql`${feeds.last_fetched_at} asc nulls first`)
        .limit(1);
        
    return firstOrUndefined(result)

}