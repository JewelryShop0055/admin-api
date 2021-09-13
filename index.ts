import * as http from "http";
import { AddressInfo } from "net";
// import * as dotenv from "dotenv";
// import * as path from "path";

if (process.env.NODE_ENV !== "production") {
  process.env.NODE_ENV = "development";
}

// dotenv.config({ path: path.join(__dirname, "./.env") });

import { app } from "./src";

function bootstrap() {
  const PORT = Number(process.env.PORT) || 3000;
  app.set("port", PORT);

  const server = http.createServer(app);

  server.listen(PORT, () => {
    const { address, port } = server.address() as AddressInfo;
    console.info("process", `server running at ${address}:${port}`);
    if (process.connected) {
      (process.send as any)("ready");
    }
  });
}
bootstrap();
