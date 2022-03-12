import { User } from "../model";
import { config } from "../configures";
import fs from "fs";
import path from "path";
import ejs from "ejs";
import nodemailer from "nodemailer";

export class MailService {
  private transporter = nodemailer.createTransport(config.mail);

  private passwordTemplate = fs.readFileSync(
    path.join(__dirname, "forgotpassword-admin.html"),
    {
      encoding: "utf-8",
    },
  );

  async sendChangePassword(user: User, newPassword: string) {
    const template = ejs.compile(this.passwordTemplate);

    await this.transporter.sendMail({
      from: `${config.app.serviceName} console <${config.app.systemEMailAddress}>`, // sender address
      to: user.email, // list of receivers
      subject: `[${config.app.serviceName} SMS] ${user.name}님의 임시 비밀번호입니다.`, // Subject line
      html: template({
        user,
        newPassword,
        serviceUrl: config.app.serviceUrl,
        serviceName: config.app.serviceName,
        copyrightYear: new Date().getFullYear(),
      }),
    });

    return true;
  }
}
