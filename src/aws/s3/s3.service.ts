import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as AWS from "aws-sdk";

@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {
    AWS.config.update(configService.get("aws"));
  }

  private s3 = new AWS.S3({
    region: this.configService.get("aws").region,
    s3ForcePathStyle: true,
    credentials: {
      accessKeyId:
        this.configService.get("aws").accessKeyId || process.env.accessKeyId,
      secretAccessKey:
        this.configService.get("aws").secretAccessKey ||
        process.env.secretAccessKey,
    },
    endpoint: this.configService.get("aws").s3Endpoint,
  });

  getInstance() {
    return this.s3;
  }
}
