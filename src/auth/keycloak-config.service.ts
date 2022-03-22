import { Injectable, Logger } from "@nestjs/common";
import {
  KeycloakConnectOptions,
  KeycloakConnectOptionsFactory,
} from "nest-keycloak-connect";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class KeycloakConfigService implements KeycloakConnectOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createKeycloakConnectOptions(): KeycloakConnectOptions {
    const config = this.configService.get("keycloak");
    Logger.debug(config);
    Logger.debug(this.configService);
    return {
      ...config,
    };
  }
}
