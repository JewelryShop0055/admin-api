import {
  Model,
  Table,
  Column,
  PrimaryKey,
  ForeignKey,
  NotNull,
  AutoIncrement,
  HasMany,
  BelongsToMany,
  HasOne,
  BelongsTo,
} from "sequelize-typescript";
import { UUID, UUIDV4 } from "sequelize";
import { User } from "./user";
import { UserCrenditional } from "./userCreditional";

@Table({
  charset: "utf8",
})
export class UserCrenditionalRealtion extends Model<UserCrenditionalRealtion> {
  @PrimaryKey
  @NotNull
  @Column({
    type: UUID,
    defaultValue: UUIDV4,
    allowNull: false,
  })
  id!: string;

  @ForeignKey(() => User)
  @NotNull
  @Column({
    allowNull: false,
  })
  userId!: number;

  @ForeignKey(() => UserCrenditional)
  @NotNull
  @Column({
    type: UUID,
    allowNull: false,
  })
  crenditionalId!: string;

  @BelongsTo(() => User, "userId")
  user?: User;

  @BelongsTo(() => UserCrenditional, "crenditionalId")
  crenditional?: UserCrenditional;
}

export default UserCrenditionalRealtion;
