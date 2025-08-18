import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {
    const response = await fetch(feedURL, {
      method: "GET",
      headers: {
        "Accept": "application/xml", 
        "User-Agent": "gator",
      },
    });

    if (!response.ok) {
      throw new Error(`failed to fetch feed: ${response.status} ${response.statusText}`);
    }

    const xmlParser = new XMLParser();

    const xml =  await response.text()
    let parsedResult = xmlParser.parse(xml);

    let channel = parsedResult.rss?.channel;
    if (!channel) {
      throw new Error("failed to parse channel");
    }

    if (
      !channel ||
      ! channel.title ||
      ! channel.link ||
      ! channel.description ||
      ! channel.item

    ) {
      throw new Error("failed to parse channel");
    }

    const items : any[] = Array.isArray(channel.item) ? channel.item : [channel.item];

    const rssItems: RSSItem[] = [];
    for (const item of items) {
      if (item.title == "" || item.link == "" || item.description == "" || item.pubDate == "") {
        continue;
      }

      rssItems.push({
        title: item.title,
        link: item.link,
        description: item.description,
        pubDate: item.pubDate,
      });
    }

    const rssFeed = {
        channel: {
          title: channel.title,
          link: channel.link,
          description: channel.description,
          item: rssItems,
        }
    };

    return rssFeed
}
