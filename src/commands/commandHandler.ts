import { User } from "src/db/schema";

export type commandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, commandHandler>;

export type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
  ) => Promise<void>;



export function registerCommand(registry: CommandsRegistry,cmdName: string, handler: commandHandler): void {
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void> {
    const handler = registry[cmdName];
    if (!handler) {
        throw new Error(`Unknown command: ${cmdName}`);
    }
    await handler(cmdName, ...args);
}

