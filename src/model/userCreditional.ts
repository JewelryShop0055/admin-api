import { UserCrenditionalRealtion } from "./userCrenditionalRelation";
import { UUID, DataTypes, UUIDV4 } from "sequelize";
import { User } from "./user";
import {
  Model,
  Table,
  Column,
  PrimaryKey,
  NotNull,
  BelongsToMany,
  HasOne,
} from "sequelize-typescript";

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
}

export default UserCrenditional;
