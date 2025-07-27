export type commandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = Record<string, commandHandler>;


export function registerCommand(registry: CommandsRegistry,cmdName: string, handler: commandHandler): void {
    registry[cmdName] = handler;
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): void {
    const handler = registry[cmdName];
    if (!handler) {
        throw new Error(`Unknown command: ${cmdName}`);
    }
    handler(cmdName, ...args);
}

