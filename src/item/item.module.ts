import { forwardRef, Module } from "@nestjs/common";
import { ItemService } from "./item.service";
import { ItemController } from "./item.controller";
import { CategoryModule } from "../category/category.module";
import { CompanyModule } from "../company/company.module";
import { S3Service } from "../aws/s3/s3.service";
import { MulterModule } from "../multer/multer.module";
import { AwsModule } from "../aws/aws.module";
import * as multerS3 from "multer-s3";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [
    AwsModule,
    DatabaseModule,
    forwardRef(() => CategoryModule),
    CompanyModule,
    MulterModule.registerAsync({
      imports: [AwsModule, ConfigModule],
      inject: [S3Service, ConfigService],
      useFactory: (s3: S3Service, configService: ConfigService) => {
        return {
          storage: multerS3({
            s3: s3.getInstance(),
            bucket: configService.get("aws").bucketName,
            acl: "public-read",
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: function (req: any /* FastifyRequest */, file, cb) {
              if (
                !["origin", "1000x1000", "500x500", "100x100"].includes(
                  file.fieldname,
                )
              ) {
                return cb(new Error("Not Allow File Field"));
              }
              cb(
                false,
                `img/${req.params["id"]}/${req.query["rav_uuid_gen"]}-${
                  file.fieldname
                }.${file.originalname.split(".").reverse()[0]}`,
              );
            },
          }),
          fileFilter: (req, file, cb) => {
            if (!file.mimetype.startsWith("image")) {
              cb(new Error("Unsupport File mimeType, allow: ['image']"), false);
            }

            cb(undefined, true);
          },
          dest: "tmp/",
        };
      },
    }),
  ],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
