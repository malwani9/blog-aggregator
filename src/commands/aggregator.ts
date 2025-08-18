import { fetchFeed } from "src/rssFeed";

export async function handlerAggregator(cmdName: string, ...args: string[]): Promise<void> {
    const feedURL = "https://www.wagslane.dev/index.xml"
    const feedData = await fetchFeed(feedURL);
    const feedDataStr = JSON.stringify(feedData, null, 2);
    console.log(feedDataStr);
}