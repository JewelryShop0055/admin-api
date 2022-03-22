import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from "nest-keycloak-connect";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CategoryModule } from "./category/category.module";
import { CompanyModule } from "./company/company.module";
import { DatabaseModule } from "./database/database.module";
import { ItemModule } from "./item/item.module";
import { yamlProvider } from "./configuration/yaml.provider";
import { SearchModule } from "./search/search.module";
import { KeycloakConfigService } from "./auth/keycloak-config.service";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [yamlProvider],
    }),
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakConfigService,
      imports: [AuthModule],
    }),
    ItemModule,
    CategoryModule,
    CompanyModule,
    DatabaseModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    AppService,
  ],
})
export class AppModule {}
