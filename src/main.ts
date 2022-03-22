import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { fastifyHelmet } from "fastify-helmet";
import { VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, "data:", "validator.swagger.io"],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = app.get(ConfigService).get("app");

  const swaggerConfig = new DocumentBuilder().addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup("docs", app, document);

  await app.listen(config.port || 3000);
}
bootstrap();
