import fs from "fs";
import YAML from "yaml";
import path from "path";
import { ScopeType } from "../src/model/scope";

interface UserInfo {
  username: string;
  password: string;
  email: string;
  name: string;
  phone: string;
}

interface ClientInfo {
  name: string;
  clientId: string;
  clientSecret: string;
  scope: ScopeType;
  grants: Array<string>;
  redirectUris: Array<string>;
  accessTokenLifetime: number;
  refreshTokenLifetime: number;
}

interface SwaggerServer {
  url: string;
  name: string;
}

interface ConfigObjects {
  app: {
    port: number;
    timezone: string;
    resource: {
      region: string;
      bucket: string;
      address: string;
    };
    serviceName: string;
    serviceUrl: string;
    systemEMailAddress: string;
    jwtSecret: string;
    [key: string]: any;
  };
  db: {
    allowSync: boolean;
    [key: string]: any;
  };
  user?: {
    operator?: Array<UserInfo>;
  };
  client?: Array<ClientInfo>;
  swagger?: {
    enable?: boolean;
    urls?: SwaggerServer[];
  };
  [key: string]: any;
}

function readConfig() {
  try {
    const yaml = fs.readFileSync(path.join(__dirname, "./config.yml"), "utf8");
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
    timezone: yaml?.app?.timezone || "Asia/Seoul",
    resource: {
      ...yaml?.app?.resource,
    },
    serviceName: yaml?.app?.serviceName || "{서비스 이름}",
    serviceUrl: yaml?.app?.serviceUrl || "http://localhost:3000",
    systemEMailAddress: yaml?.app?.systemEMailAddress || "noreply@example.com",
    jwtSecret: yaml.app.jwtSecret || "something secret",
    ...yaml?.app,
  },
  db: {
    allowSync: yaml?.db?.allowSync || false,
    ...yaml?.db,
  },
  ...yaml,
};

export const swaggerHelmetSetting = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [
        `'self'`,
        ...(config.swagger?.urls?.map<string>((v: SwaggerServer) =>
          v.url.replace(/https?:\/\//, ""),
        ) || []),
      ],
      imgSrc: ["'self'", "data:", "validator.swagger.io"],
      scriptSrc: ["'self'", `'unsafe-eval'`, `https: 'unsafe-inline'`],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
};
