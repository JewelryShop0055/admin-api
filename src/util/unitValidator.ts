import { ItemUnitType, ItemUnitTypes } from "../model";

export function unitValidator(
  unit: string | ItemUnitType | undefined,
): ItemUnitType | undefined {
  if (!ItemUnitTypes[unit || ""]) {
    return undefined;
  } else {
    return unit as ItemUnitType;
  }
}
