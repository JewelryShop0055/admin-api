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

@Table({
  charset: "utf8",
})
export class Client extends Model<Client> {
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
  })
  name!: string;

  @NotNull
  @Column({
    type: TEXT,
    allowNull: false,
  })
  clientId!: string;

  @NotNull
  @Column({
    type: TEXT,
    allowNull: false,
  })
  clientSecret!: string;

  @NotNull
  @Column({
    allowNull: false,
    defaultValue: ScopeTypes.customer,
  })
  scope!: ScopeType;

  @NotNull
  @Column({
    allowNull: false,
    type: ARRAY(TEXT),
  })
  redirectUris!: string[];

  @NotNull
  @Column({
    allowNull: false,
    type: ARRAY(TEXT),
  })
  grants!: string[];

  @NotNull
  @Column({
    allowNull: false,
    defaultValue: 600,
  })
  accessTokenLifetime!: number;

  @NotNull
  @Column({
    allowNull: false,
    defaultValue: 3600,
  })
  refreshTokenLifetime!: number;

  @HasMany(() => UserToken)
  tokens?: UserToken[];
}

export default Client;
