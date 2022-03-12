import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import SwaggerUi from "swagger-ui-express";
import router from "./router";
import * as middleware from "./middleware";
import swaggereJsdoc, { Components, SecurityScheme } from "swagger-jsdoc";
import { config, swaggerHelmetSetting } from "./configures";

const app: express.Application = express();
app.use(cors());
app.use(helmet(config.swagger?.enable ? swaggerHelmetSetting : undefined));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const options: swaggereJsdoc.Options = {
  swaggerDefinition: {
    openapi: "3.0.3",
    info: {
      title: "Jewerly API",
      version: "1.0.0",
      description: "Jewerly API with express",
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
        maxPage: {
          description: "Total Page No",
          required: true,
          type: "integer",
          example: 100,
        },
        currentPage: {
          description: "Current Page No",
          required: true,
          type: "integer",
          example: 1,
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "oauth2",
          scheme: "bearer",
          bearerFormat: "JWT",
          flows: {
            password: {
              tokenUrl: `/v1/auth/token`,
              refreshUrl: `/v1/auth/token`,
              scopes: {
                operator: "Shop Owner",
                customer: "Customer",
              },
            },
          },
        } as SecurityScheme,
      },
      responses: {
        204: {
          description: `No Content.
            success status response code indicates that a request has succeeded.
            https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204`,
        },
        401: {
          description: "Unauthorized",
        },
        404: {
          description: "NOT FOUND",
        },
      },
    } as Components,
    security: {
      bearerAuth: [],
    },
    servers: config.swagger?.urls,
    basePath: process.env.BASE_URL,
  },
  apis: [`${__dirname}/router/**/*.js`, `${__dirname}/model/**/*.js`],
};

const specs = swaggereJsdoc(options);

if (config.swagger?.enable) {
  app.get("/docs/swagger.json", (req, res) => {
    return res.json(specs);
  });

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
}

app.use(router);

app.use(middleware.errorHandler);

export { app };
export default app;
