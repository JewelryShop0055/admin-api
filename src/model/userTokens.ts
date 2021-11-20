import { DATE, TEXT, UUID, UUIDV4 } from "sequelize";
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import { Client } from "./client";
import { ScopeEnum, ScopeType } from "./scope";
import { User } from "./user";

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
  indexes: [
    {
      unique: true,
      name: "access_unique",
      fields: ["accessToken"],
    },
    {
      unique: true,
      name: "refresh_unique",
      fields: ["refreshToken"],
    },
  ],
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
    unique: "access_unique",
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
    unique: "refresh_unique",
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
