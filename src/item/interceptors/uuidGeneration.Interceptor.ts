import {
  CallHandler,
  ExecutionContext,
  mixin,
  NestInterceptor,
  Type,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { Observable } from "rxjs";
import { v1 as uuid } from "uuid";

export function UuidGenerationInterceptor(): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToHttp();

      const req: FastifyRequest = ctx.getRequest();
      req.query["rav_uuid_gen"] = uuid();

      return next.handle();
    }
  }
  const Interceptor = mixin(MixinInterceptor);
  return Interceptor;
}
