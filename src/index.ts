import { handlerAddFeed, handlerListFeeds } from "./commands/feeds";
import { handlerAggregator } from "./commands/aggregator";
import { CommandsRegistry, registerCommand, runCommand } from "./commands/commandHandler";
import { handlerReset } from "./commands/reset";
import { handlerLogin, handlerRegister, handlerListUsers } from "./commands/users";
import { fetchFeed } from "./rssFeed.js"
import { handlerFollowFeed, handlergetFollowedFeedsForUser } from "./commands/feed_follows";

async function main() {
    await fetchFeed("https://www.wagslane.dev/index.xml");
    const args = process.argv.slice(2);

    if (args.length < 1) {
     console.log("Usage: cli <command> [args...]");
     process.exit(1);
    }

    const cmdName = args[0];
    const cmdargs = args.slice(1);

    const registry: CommandsRegistry = {};

    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "reset", handlerReset);
    registerCommand(registry, "users", handlerListUsers);
    registerCommand(registry, "agg", handlerAggregator);
    registerCommand(registry, "addfeed", handlerAddFeed);
    registerCommand(registry, "feeds", handlerListFeeds);
    registerCommand(registry, "follow", handlerFollowFeed);
    registerCommand(registry, "following", handlergetFollowedFeedsForUser);

    try {
       await runCommand(registry, cmdName, ...cmdargs);
    } catch (error) {
        if (error instanceof Error) {
            console.log(`Error running command '${cmdName}': ${error.message}`);
        } else {
            console.log(`Error running command '${cmdName}': ${error}`);
        }
      process.exit(1)
    }
    process.exit(0);
}

main();