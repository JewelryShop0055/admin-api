import { UserCrenditionalRealtion } from "./userCrenditionalRelation";
import { UserCrenditional } from "./userCreditional";
import UserToken from "./userTokens";
import { ScopeTypes, ScopeEnum, ScopeType } from "./scope";
import {
  Model,
  Table,
  Column,
  PrimaryKey,
  NotNull,
  AutoIncrement,
  HasMany,
  BelongsToMany,
} from "sequelize-typescript";

export interface CreateUserInput {
  name: string;
  phone: string;
  email: string;
  scope: ScopeType;
}

@Table({
  charset: "utf8",
})
export class User extends Model<User, CreateUserInput> {
  @AutoIncrement
  @PrimaryKey
  @NotNull
  @Column({
    allowNull: false,
  })
  id!: number;

  @Column
  @Column({
    allowNull: false,
  })
  name!: string;

  @Column({})
  phone!: string;

  @Column({})
  email!: string;

  @NotNull
  @Column({
    allowNull: false,
    defaultValue: ScopeTypes.customer,
    type: ScopeEnum,
  })
  scope!: ScopeType;

  @HasMany(() => UserToken)
  tokens?: UserToken[];

  @HasMany(() => UserCrenditionalRealtion)
  crenditionalRealtions?: UserCrenditionalRealtion[];

  @BelongsToMany(() => UserCrenditional, () => UserCrenditionalRealtion)
  crenditionals?: UserCrenditional[];
}

export default User;
