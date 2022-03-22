import { ApiProperty } from "@nestjs/swagger";
import { Company, Item } from "../entities";

export class CreateItemCompanyRelationDto {
  itemId!: string;

  @ApiProperty()
  companyId!: string;

  company?: Company;

  item?: Item;
}
