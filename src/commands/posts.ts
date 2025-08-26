import { getPostsForUser } from "src/db/queries/posts";
import { User } from "src/db/schema";


export async function handlergetPostsForUser(cmdName: string, user: User, ...args: string[]) {
    if (!user) {
        throw new Error(`User '${user}' not found`);
    }

    let limit = 2;
    if(args.length === 1) {
        limit = parseInt(args[0])
    }

    const posts = await getPostsForUser(user.id, limit);

    if(posts.length === 0) {
        console.log(`No feeds found for user: ${user.name}`);
        return;
    }

    console.log(`Posts for user "${user.name}": `)
    for (const post of posts){
        console.log(`Published at: ${post.publishDate}, from "${user.name}"`);
        console.log(` --- ${post.title} ---`);
        console.log(`     ${post.description}`);
        console.log(`link: ${post.url}`);
        console.log("=========================================================");
    }
}