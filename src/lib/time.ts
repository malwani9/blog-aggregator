
export function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if (!match) {
        throw new Error(`Failed to parse duration: ${durationStr}`);
    }

    if (match.length !== 3) return 0;

    let value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case "ms":
            value *= 1;
            break;
        case "s":
            value *= 1000;
            break;
        case "m":
            value *= 60000;
            break;
        case "h":
            value *= 3600000
            break;
    }

    return value;

}