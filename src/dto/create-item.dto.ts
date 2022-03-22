import { ApiProperty } from "@nestjs/swagger";

import { ItemType, ItemUnitType } from "../types";

export class CreateItemDto {
  type!: ItemType;

  @ApiProperty()
  partNo?: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  unit!: ItemUnitType;

  @ApiProperty()
  defaultFee?: number;

  @ApiProperty()
  extraFee?: number;

  @ApiProperty()
  memo?: string;

  @ApiProperty()
  displayable?: boolean;

  @ApiProperty()
  soldOut?: boolean;

  @ApiProperty()
  revNo?: number;
}
