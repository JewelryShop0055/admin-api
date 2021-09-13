import { UUID, TEXT, DATE, UUIDV4 } from "sequelize";
import {
  Model,
  Table,
  Column,
  PrimaryKey,
  ForeignKey,
  NotNull,
  AutoIncrement,
  HasOne,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./user";
import { Client } from "./client";
import { ScopeEnum, ScopeType } from "./scope";

export interface CreateUserTokenInput {
  clientId: string;
  userId: number;
  scope: string;
  accessToken: string;
  expiredIn: Date;
  refreshToken: string;
  refreshExpiredIn: Date;
}

@Table({
  charset: "utf8",
})
export class UserToken extends Model<UserToken, CreateUserTokenInput> {
  @PrimaryKey
  @NotNull
  @Column({
    type: UUID,
    defaultValue: UUIDV4,
    allowNull: false,
  })
  id!: string;

  @ForeignKey(() => Client)
  @Column({
    type: UUID,
    allowNull: false,
  })
  clientId!: string;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
  })
  userId!: number;

  @Column({
    type: ScopeEnum,
    allowNull: false,
  })
  scope!: ScopeType;

  @NotNull
  @Column({
    type: TEXT,
    allowNull: false,
  })
  accessToken!: string;

  @NotNull
  @Column({
    type: DATE,
    allowNull: false,
  })
  expiredIn!: Date;

  @NotNull
  @Column({
    type: TEXT,
    allowNull: false,
  })
  refreshToken!: string;

  @NotNull
  @Column({
    type: DATE,
    allowNull: false,
  })
  refreshExpiredIn!: Date;

  @BelongsTo(() => Client, "clientId")
  client?: Client;

  @BelongsTo(() => User, "userId")
  user?: User;
}

export default UserToken;
