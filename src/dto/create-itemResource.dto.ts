import { ItemFileType } from "../types";

export class CreateItemResourceDto {
  key: string;
  type: ItemFileType;
  itemId: string;
}
