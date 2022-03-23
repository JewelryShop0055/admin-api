import { CreateItemDto } from "./create-item.dto";
import { PickType } from "@nestjs/swagger";

export class UpdateItemDto extends PickType(CreateItemDto, [
  "name",
  "unit",
  "defaultFee",
  "extraFee",
  "memo",
  "displayable",
  "soldOut",
  "revNo",
] as const) {}
