import { CommandsRegistry, registerCommand, runCommand } from "./commands/commandHandler.js";
import { handlerLogin } from "./commands/login.js";

function main() {
    const args = process.argv.slice(2);

    if (args.length < 1) {
     console.log("Usage: cli <command> [args...]");
     process.exit(1);
    }

    const cmdName = args[0];
    const cmdargs = args.slice(1);

    const registry: CommandsRegistry = {};

    registerCommand(registry, "login", handlerLogin);

    try {
        runCommand(registry, cmdName, ...cmdargs);
    } catch (error) {
        if (error instanceof Error) {
            console.log(`Error running command '${cmdName}': ${error.message}`);
        } else {
            console.log(`Error running command '${cmdName}': ${error}`);
        }
      process.exit(1)
    }

}

main();