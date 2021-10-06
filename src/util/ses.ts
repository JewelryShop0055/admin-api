import { SES } from "aws-sdk";
import { User } from "../model";
import { config } from "../../configures/config";
import { SendEmailRequest } from "aws-sdk/clients/ses";
import fs from "fs";
import path from "path";
import ejs from "ejs";

export class SesManager {
  private ses = new SES({
    region: config.app.resource.region,
  });

  private passwordTemplate = fs.readFileSync(
    path.join(__dirname, "forgotpassword-admin.html"),
    {
      encoding: "utf-8",
    },
  );

  async sendChangePassword(user: User, newPassword: string) {
    const template = ejs.compile(this.passwordTemplate);

    const params: SendEmailRequest = {
      Destination: {
        ToAddresses: [user.email],
      },
      Source: `${config.app.serviceName} console <${config.app.systemEMailAddress}>`,
      Message: {
        Subject: {
          Data: `[${config.app.serviceName} SMS] ${user.name}님의 임시 비밀번호입니다.`,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: template({
              user,
              newPassword,
              serviceUrl: config.app.serviceUrl,
              serviceName: config.app.serviceName,
            }),
            Charset: "UTF-8",
          },
        },
      },
    };

    const result = await this.ses.sendEmail(params).promise();

    if (result.$response.error) {
      throw result.$response.error;
    } else {
      return true;
    }
  }
}
