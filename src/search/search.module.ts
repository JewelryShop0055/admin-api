import { Module } from "@nestjs/common";
import { SearchController } from "./search.controller";
import { CompanyModule } from "../company/company.module";
import { CategoryModule } from "../category/category.module";
import { ItemModule } from "../item/item.module";
import { SearchService } from "./search.service";

@Module({
  imports: [CompanyModule, CategoryModule, ItemModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
