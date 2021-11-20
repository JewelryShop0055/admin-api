import { PresignedPost } from "aws-sdk/clients/s3";

export interface ResourceBody {
  resourceId: string;
}

export interface UploadCrenditionalBody {
  crenditional: PresignedPost;
  resourceId: string;
}

export interface RequestUploadCrenditional {
  ext: string;
  fileType: string;
}
