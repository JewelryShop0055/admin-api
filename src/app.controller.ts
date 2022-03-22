import { Controller, Get, Header, HttpCode } from "@nestjs/common";
import { Public } from "nest-keycloak-connect";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/health")
  @Public()
  @Header("Cache-Control", "none")
  @HttpCode(204)
  health() {
    return "OK";
  }
}
