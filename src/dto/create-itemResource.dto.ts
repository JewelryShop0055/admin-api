import { ItemFileType, ResourcePath } from "../types";

export class CreateItemResourceDto {
  id: string;
  key: string;
  type: ItemFileType;
  itemId: string;
  paths: ResourcePath;
  order: number;
}
