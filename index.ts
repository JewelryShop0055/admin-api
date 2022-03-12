import * as http from "http";
import { AddressInfo } from "net";
import { app, config } from "./src";
import { cronManager, dbSync } from "./src/util";

async function bootstrap() {
  await dbSync(config.db.allowSync);

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
