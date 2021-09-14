import {
  Model,
  Table,
  Column,
  PrimaryKey,
  NotNull,
  BelongsToMany,
  HasOne,
} from "sequelize-typescript";
import { UserCrenditionalRealtion } from "./userCrenditionalRelation";
import { UUID, DataTypes, UUIDV4 } from "sequelize";
import { User } from "./user";
import crypto from "crypto";
import util from "util";

const randomBytes = util.promisify(crypto.randomBytes);
const pbkdf2 = util.promisify(crypto.pbkdf2);

export const CrenditionalTypes = {
  password: "password",
  kakao: "kakao",
  naver: "naver",
  google: "google",
};

export type CrenditionalType =
  typeof CrenditionalTypes[keyof typeof CrenditionalTypes];

export interface CreateUserCrenditionalInput {
  type: CrenditionalType;
  username: string;
  password: string;
}

@Table({
  charset: "utf8",
})
export class UserCrenditional extends Model<
  UserCrenditional,
  CreateUserCrenditionalInput
> {
  @PrimaryKey
  @NotNull
  @Column({
    type: UUID,
    defaultValue: UUIDV4,
    allowNull: false,
  })
  id!: string;

  @NotNull
  @Column({
    type: DataTypes.ENUM({
      values: ["password", "kakao", "naver", "google"],
    }),
    allowNull: false,
  })
  type!: CrenditionalType;

  /**
   * 소셜 로그인의 경우 username과 value과 동일함
   */
  @NotNull
  @Column({
    allowNull: false,
  })
  username!: string;

  /**
   * 소셜 로그인의 경우 username과 value과 동일함
   */
  @NotNull
  @Column({
    allowNull: false,
  })
  password!: string;

  @HasOne(() => UserCrenditionalRealtion)
  crenditionalRealtions?: UserCrenditionalRealtion[];

  @BelongsToMany(() => User, () => UserCrenditionalRealtion)
  user?: User[];

  static async encryptPassword(plainPassword: string) {
    const salt = (await randomBytes(32)).toString("base64");
    const hashed = (
      await pbkdf2(plainPassword, salt, 624, 64, "sha512")
    ).toString("base64");

    return `${salt}:${hashed}`;
  }

  async verifyPassword(plainPassword: string) {
    if (this.type === CrenditionalTypes.password) {
      const [salt, envcyptedPassword] = this.password.split(":");
      const hashed = (
        await pbkdf2(plainPassword, salt, 624, 64, "sha512")
      ).toString("base64");

      if (envcyptedPassword === hashed) {
        return true;
      } else {
        return false;
      }
    } else {
      throw new Error(`Unsupport CrenditionalType ${this.type}`);
    }
  }
}

export default UserCrenditional;
