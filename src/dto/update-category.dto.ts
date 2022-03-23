import { OmitType, PickType } from "@nestjs/swagger";
import { CreateCategoryDto } from "./create-category.dto";

export class UpdateCategoryDto extends PickType(CreateCategoryDto, [
  "name",
] as const) {}
