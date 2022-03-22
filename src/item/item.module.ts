import { forwardRef, Module } from "@nestjs/common";
import { ItemService } from "./item.service";
import { ItemController } from "./item.controller";
import { CategoryModule } from "../category/category.module";
import { CompanyModule } from "../company/company.module";

@Module({
  imports: [forwardRef(() => CategoryModule), CompanyModule],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
