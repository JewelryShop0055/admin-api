import { ApiProperty } from "@nestjs/swagger";

export class CreateCompanyDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  postCode!: string;

  @ApiProperty()
  address!: string;

  @ApiProperty()
  detailAddress?: string;

  @ApiProperty()
  phone!: string;
}
