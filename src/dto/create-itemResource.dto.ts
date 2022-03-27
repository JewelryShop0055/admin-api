import { ItemFileType, ResourcePath } from "../types";
import { Item } from "../entities/item.entity";

export class CreateItemResourceDto {
  id: string;
  key: string;
  type: ItemFileType;
  item: Item;
  paths: ResourcePath;
  order: number;
}
