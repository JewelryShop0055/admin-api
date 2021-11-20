import { jsonIgnore } from "json-ignore";
import { UUID, UUIDV4 } from "sequelize";
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import { User } from "./user";
import { UserCrenditional } from "./userCreditional";

export interface CreateUserCrenditionalRealtionInput {
  userId: number;
  crenditionalId: string;
}

@Table({
  charset: "utf8",
})
export class UserCrenditionalRealtion extends Model<
  UserCrenditionalRealtion,
  CreateUserCrenditionalRealtionInput
> {
  @jsonIgnore()
  @PrimaryKey
  @NotNull
  @Column({
    type: UUID,
    defaultValue: UUIDV4,
    allowNull: false,
  })
  id!: string;

  @jsonIgnore()
  @ForeignKey(() => User)
  @NotNull
  @Column({
    allowNull: false,
  })
  userId!: number;

  @jsonIgnore()
  @ForeignKey(() => UserCrenditional)
  @NotNull
  @Column({
    type: UUID,
    allowNull: false,
  })
  crenditionalId!: string;

  @jsonIgnore()
  @BelongsTo(() => User, "userId")
  user?: User;

  @jsonIgnore()
  @BelongsTo(() => UserCrenditional, "crenditionalId")
  crenditional?: UserCrenditional;
}

export default UserCrenditionalRealtion;
