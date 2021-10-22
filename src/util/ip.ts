import { Request } from "express";

export function getIp(req: Request) {
  return req.header("X-FORWARDED-FOR") || req.ip.split(":").pop() || "unkown";
}
