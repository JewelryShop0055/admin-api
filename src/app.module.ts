import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CategoryModule } from "./category/category.module";
import { CompanyModule } from "./company/company.module";
import { DatabaseModule } from "./database/database.module";
import { ItemModule } from "./item/item.module";
import { yamlProvider } from "./configuration/yaml.provider";

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [yamlProvider],
    }),
    ItemModule,
    CategoryModule,
    CompanyModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
