import express from "express";
import cors from "cors";
// import helmet from "helmet";
import compression from "compression";
import SwaggerUi from "swagger-ui-express";
import bodyParser from "body-parser";
import { passport } from "./oauth";
import router from "./router";
import * as middleware from "./middleware";
import swaggereJsdoc, { Components, SecurityScheme } from "swagger-jsdoc";

const app: express.Application = express();
app.use(cors());
// app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

const options: swaggereJsdoc.Options = {
  swaggerDefinition: {
    openapi: "3.0.3",
    info: {
      title: "Jwerly API",
      version: "1.0.0",
      description: "Jwerly API with express",
    },
    components: {
      schemas: {
        createdAt: {
          description: "Created Date",
          required: true,
          type: "string",
          format: "date-time",
        },
        updatedAt: {
          description: "Last Modified Date",
          required: true,
          type: "string",
          format: "date-time",
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "oauth2",
          scheme: "bearer",
          bearerFormat: "JWT",
          flows: {
            password: {
              tokenUrl: `/admin/auth/token`,
              refreshUrl: `/admin/auth/token`,
              scopes: {
                operator: "Shop Owner",
                customer: "Customer",
              },
            },
          },
        } as SecurityScheme,
      },
    } as Components,
    security: {
      bearerAuth: [],
    },
  },
  apis: [`${__dirname}/router/**/*.js`, `${__dirname}/model/**/*.js`],
};

const specs = swaggereJsdoc(options);

app.use(
  "/docs",
  SwaggerUi.serve,
  SwaggerUi.setup(specs, {
    explorer: true,
    swaggerOptions: {
      swaggerUrl: process.env.BASE_URL,
    },
  }),
);

app.use(router);

app.use(middleware.errorHandler);

export { app };
export default app;
