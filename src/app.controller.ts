import { Controller, Get, Header, HttpCode } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/health")
  @Header("Cache-Control", "none")
  @HttpCode(204)
  health() {
    return "OK";
  }
}
