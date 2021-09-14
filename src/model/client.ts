import {
  Table,
  Model,
  PrimaryKey,
  NotNull,
  Column,
  HasMany,
} from "sequelize-typescript";
import { ARRAY, UUID, TEXT, UUIDV4 } from "sequelize";
import UserToken from "./userTokens";
import { ScopeTypes, ScopeType } from "./scope";

export interface CreateClientInput {
  name: string;
  clientId: string;
  clientSecret: string;
  grants: string[];
  scope: ScopeType;
  redirectUris: string[];
  accessTokenLifetime?: number;
  refreshTokenLifetime?: number;
}

@Table({
  charset: "utf8",
  indexes: [
    {
      unique: true,
      name: "client_unique",
      fields: ["clientId"],
    },
    {
      unique: true,
      name: "client_name_unique",
      fields: ["name"],
    },
  ],
})
export class Client extends Model<Client, CreateClientInput> {
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
    type: TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      isNull: false,
    },
  })
  name!: string;

  @NotNull
  @Column({
    type: TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      isNull: false,
    },
  })
  clientId!: string;

  @NotNull
  @Column({
    type: TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      isNull: false,
    },
  })
  clientSecret!: string;

  @NotNull
  @Column({
    allowNull: false,
    defaultValue: ScopeTypes.customer,
    validate: {
      notEmpty: true,
      isNull: false,
      isLowercase: true,
    },
  })
  scope!: ScopeType;

  @NotNull
  @Column({
    allowNull: false,
    type: ARRAY(TEXT),
    validate: {
      isArray: true,
      notEmpty: true,
      isNull: false,
    },
  })
  redirectUris!: string[];

  @NotNull
  @Column({
    allowNull: false,
    type: ARRAY(TEXT),
    validate: {
      isArray: true,
      notEmpty: true,
      isNull: false,
    },
  })
  grants!: string[];

  @NotNull
  @Column({
    allowNull: false,
    defaultValue: 600,
    validate: {
      isNumeric: true,
      min: 60,
      isNull: false,
    },
  })
  accessTokenLifetime!: number;

  @NotNull
  @Column({
    allowNull: false,
    defaultValue: 3600,
    validate: {
      isNumeric: true,
      min: 60,
      isNull: false,
    },
  })
  refreshTokenLifetime!: number;

  @HasMany(() => UserToken)
  tokens?: UserToken[];
}

export default Client;
