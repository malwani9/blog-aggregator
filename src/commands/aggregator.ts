import { getNextFeedToFetch, markFeedFetched } from "src/db/queries/feeds";
import { createPost } from "src/db/queries/posts";
import { NewPost } from "src/db/schema";
import { parseDuration } from "src/lib/time";
import { fetchFeed } from "src/rssFeed";

export async function handlerAggregator(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <time between requestes>`);
    }
    const durationStr = args[0];
    const timeBetweenRequests = parseDuration(durationStr);
    if (!timeBetweenRequests) {
        throw new Error(`Invalid duration: ${durationStr} -- use formate 1h 30m 10s or 4000ms`);
    }
    
    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}


async function scrapeFeeds() {
    const nextFeed = await getNextFeedToFetch();
    if (!nextFeed){
        throw new Error(`Failed to get next feed`);
    }

    const result = await markFeedFetched(nextFeed.id);
    if (!result) {
        throw new Error("Failed to update feed as fetched");
    }

    const feed = await fetchFeed(nextFeed.url);
    if (!feed) {
        throw new Error("Failed to fetch feed");
    }

    console.log(`< [ ${feed.channel.title} feed posts ] >`);
    console.log("===========================================");
    for (const post of feed.channel.item) {
        console.log(` * ${post.title}`);
        const now = new Date();
        await createPost({
            title: post.title,
            url: post.link,
            description: post.description,
            publishDate: new Date(post.pubDate),
            feed_id: nextFeed.id,
            createdAt: now,
            updatedAt: now,
            } satisfies NewPost);
        console.log(`Post add to DB.`);

    }
    console.log("===========================================");
}

function handleError(error: unknown) {
   console.error(`Error during feed scraping: ${error instanceof Error ? error.message : error}`);
}
