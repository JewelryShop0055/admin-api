import { ItemType } from "../types";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
  type!: ItemType;

  @ApiProperty()
  name!: string;
}
