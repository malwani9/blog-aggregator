import { readConfig, setUser } from "./config";

function main() {
    setUser("mohammed");
    console.log(readConfig());
}

main();