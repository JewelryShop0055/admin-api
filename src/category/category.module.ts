import { forwardRef, Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { ItemModule } from "../item/item.module";

@Module({
  imports: [forwardRef(() => ItemModule)],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
