import { S3 } from "aws-sdk";
import { config } from "../../configures/config";
import util from "util";

export class S3Manager {
  private static s3: S3;
  static getResourceBucket() {
    if (!S3Manager.s3) {
      S3Manager.s3 = new S3({
        region: config.app.resource.region,
      });
    }

    return S3Manager.s3;
  }

  static async getImageUploadCrenditional(key: string, resourceId: string) {
    const s3 = S3Manager.getResourceBucket();
    const sign = s3.createPresignedPost({
      Bucket: config.app.resource.bucket,
      Expires: 60 * 1,
      Fields: {
        key,
      },
      Conditions: [
        ["content-length-range", 0, 15 * 1024 * 1024],
        ["starts-with", "$Content-Type", "image/"],
        ["eq", "$x-amz-meta-resourceId", resourceId],
      ],
    });

    sign.fields["x-amz-meta-resourceId"] = resourceId;

    return sign;
  }

  static async deleteFile(key: string) {
    const s3 = S3Manager.getResourceBucket();
    await s3
      .deleteObject({
        Bucket: config.app.resource.bucket,
        Key: key,
      })
      .promise();
    return true;
  }
}
