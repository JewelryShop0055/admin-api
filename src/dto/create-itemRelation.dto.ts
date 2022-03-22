import { ApiProperty } from "@nestjs/swagger";
import Item from "../entities/item.entity";

export class CreateItemRelationDto {
  productId!: string;

  product?: Item;

  @ApiProperty()
  partsId!: string;

  parts?: Item;

  @ApiProperty()
  amount!: number;

  @ApiProperty()
  memo?: string;
}
