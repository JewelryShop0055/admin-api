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

const hashPasswordHook = async (crendition: UserCrenditional, options) => {
  if (crendition.type == CrenditionalTypes.password) {
    if (crendition.changed("password")) {
      const plainPassword = crendition.password;

      if (!plainPassword || plainPassword === "") {
        throw new Error("Not validate Passowrd. Password Must Not Null");
      }

      const salt = (await randomBytes(32)).toString("base64");
      const hashed = (
        await pbkdf2(plainPassword, salt, 624, 64, "sha512")
      ).toString("base64");

      crendition.password = `${salt}:${hashed}`;
    }
  } else {
    if (
      !crendition.password ||
      crendition.password === "" ||
      crendition.changed("password") ||
      crendition.changed("username")
    ) {
      crendition.password = crendition.username;
    }
  }
};

@Table({
  charset: "utf8",
  indexes: [
    {
      unique: true,
      name: "unique_user",
      fields: ["type", "username"],
    },
  ],
  hooks: {
    beforeSave: hashPasswordHook,
  },
}) //
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
    unique: "unique_user",
    validate: {
      notEmpty: true,
      notNull: true,
    },
  })
  type!: CrenditionalType;

  /**
   * 소셜 로그인의 경우 username과 value과 동일함
   */
  @NotNull
  @Column({
    allowNull: false,
    unique: "unique_user",
    validate: {
      notEmpty: true,
      notNull: true,
    },
  })
  username!: string;

  /**
   * 소셜 로그인의 경우 username과 value과 동일함
   */
  @NotNull
  @Column({
    allowNull: false,
    validate: {
      notEmpty: true,
      notNull: true,
    },
  })
  password!: string;

  @HasOne(() => UserCrenditionalRealtion)
  crenditionalRealtions?: UserCrenditionalRealtion[];

  @BelongsToMany(() => User, () => UserCrenditionalRealtion)
  user?: User[];

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
