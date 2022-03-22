import { readFileSync } from "fs";
import * as yaml from "js-yaml";
import { join } from "path";
const YAML_CONFIG = "config.yml";

export const yamlProvider = () => {
  return yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG), "utf8"),
  ) as Record<string, any>;
};
