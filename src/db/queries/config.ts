import fs from "fs";
import os from "os";
import path from "path";


type Config = {
    dbUrl: string;
    currentUserName: string;
};

export function setUser(userName: string): void {
    const configObj = readConfig();
    configObj.currentUserName = userName;
    writeConfig(configObj);
}

function validateConfig(rawConfig: any) {
    if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
        throw new Error(`db_url is required in config file`);
    }

    if (!rawConfig.current_user_name || typeof rawConfig.current_user_name !== "string") {
        throw new Error(`current_user_name is required in config file`);
    }

    const config: Config = {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name,
    }

    return config;
}

export function readConfig() {
    const configPath = getConfigFilePath();

    const data = fs.readFileSync(configPath, 'utf-8');
    const rawConfig = JSON.parse(data);

    return validateConfig(rawConfig); 
}

function getConfigFilePath(): string {
    const configFile = '.gatorconfig.json';
    const homeDir = os.homedir();
    const targetPath = path.join(homeDir, configFile);
    return targetPath;
}

function writeConfig(config: Config): void {
    const configFilePath = getConfigFilePath();

    const rawConfig = {
        db_url: config.dbUrl,
        current_user_name: config.currentUserName,
    };

    const data = JSON.stringify(rawConfig, null, 2);
    fs.writeFileSync(configFilePath, data, {encoding: "utf-8"});
}

