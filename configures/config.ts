import fs from "fs";
import YAML from "yaml";

interface ConfigObjects {
  app: {
    port: number;
    [key: string]: any;
  };
  db: {
    allowSync: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

function readConfig() {
  try {
    const yaml = fs.readFileSync("./config.yml", "utf8");
    try {
      return YAML.parse(yaml);
    } catch (e) {
      console.error(e);
    }
  } catch (e: unknown) {
    console.error((e as Error).message);
    console.error(`RUN default Config`);
  }
}

const yaml = readConfig();

process.env.NODE_ENV = yaml?.NODE_ENV || process.env.NODE_ENV || "development";

export const config: ConfigObjects = {
  app: {
    port: yaml?.app?.port || 3001,
    ...yaml?.app,
  },
  db: {
    allowSync: yaml?.db?.allowSync || false,
    ...yaml?.db,
  },
  ...yaml,
};
