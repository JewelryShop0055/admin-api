import express from "express";
import cors from "cors";
// import helmet from "helmet";
import compression from "compression";
import SwaggerUi from "swagger-ui-express";
import bodyParser from "body-parser";
import { passport } from "./oauth";
import router from "./router";
import * as middleware from "./middleware";

const app: express.Application = express();
app.use(cors());
// app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/docs", SwaggerUi.serve);
app.get("/docs", SwaggerUi.setup());
app.use(router);

app.use(middleware.errorHandler);

export { app };
export default app;
