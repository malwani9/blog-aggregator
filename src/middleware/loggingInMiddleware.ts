import { commandHandler, UserCommandHandler } from "src/commands/commandHandler";
import { readConfig } from "src/config";
import { getUser } from "src/db/queries/users";


export function middlewareLoggedIn(handler: UserCommandHandler) : commandHandler {

   async function innerFunction(cmdName: string, ...args: string[]){
      const config = readConfig();
      if (!config.currentUserName) {
         throw new Error("User noy logged in");
      }

      const user = await getUser(config.currentUserName);
      if (!user) {
          throw new Error(`User ${user} not found`);
      }
      return await handler(cmdName, user, ...args);
   }
   return innerFunction;
}