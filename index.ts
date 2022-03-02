import * as http from "http";
import { AddressInfo } from "net";
import { config } from "./src/configures/config";
import { app } from "./src";
import { sync } from "./src/model";
import { cronManager } from "./src/util";

async function bootstrap() {
  await sync(config.db.allowSync);

  const server = http.createServer(app);

  server.listen(config.app.port, () => {
    const { address, port } = server.address() as AddressInfo;
    console.info("process", `server running at ${address}:${port}`);
    if (process.connected) {
      (process.send as any)("ready");
    }
  });

  cronManager.start();
}

bootstrap();
