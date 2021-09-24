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
import { jsonIgnore } from "json-ignore";

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     CreateUserInput:
 *       type: object
 *       properties:
 *         name:
 *           description: "name of user that needs to be created"
 *           required: true
 *           type: "string"
 *         phone:
 *           description: "phone of user that needs to be created"
 *           required: true
 *           type: "string"
 *           example: "01012341234"
 *         email:
 *           description: "email of user that needs to be created"
 *           required: true
 *           type: "string"
 *           format: email
 */
export interface CreateUserInput {
  name: string;
  phone: string;
  email: string;
  scope: ScopeType;
}

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         name:
 *           description: "name of user that needs to be updated"
 *           required: false
 *           type: "string"
 *         phone:
 *           description: "phone of user that needs to be updated"
 *           required: false
 *           type: "string"
 *           example: "01012341234"
 *         email:
 *           description: "email of user that needs to be updated"
 *           required: false
 *           type: "string"
 *           format: email
 */
export class UpdateUserInput {
  name?: string;
  phone?: string;
  email?: string;
}

/**
 * @openapi
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           description: "id of user"
 *           required: true
 *           type: "string"
 *         name:
 *           description: "name of user"
 *           required: true
 *           type: "string"
 *         phone:
 *           description: "phone of user"
 *           required: true
 *           type: "string"
 *           example: "01012341234"
 *         email:
 *           description: "email of user"
 *           required: true
 *           type: "string"
 *           format: email
 *         scope:
 *           $ref: "#/components/schemas/ScopeType"
 *         createdAt:
 *           $ref: "#/components/schemas/createdAt"
 *         updatedAt:
 *           $ref: "#/components/schemas/updatedAt"
 */
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

  @jsonIgnore()
  @HasMany(() => UserToken, {
    onDelete: "CASCADE",
  })
  tokens?: UserToken[];

  @jsonIgnore()
  @HasMany(() => UserCrenditionalRealtion, {
    onDelete: "CASCADE",
  })
  crenditionalRealtions?: UserCrenditionalRealtion[];

  @jsonIgnore()
  @BelongsToMany(() => UserCrenditional, () => UserCrenditionalRealtion)
  crenditionals?: UserCrenditional[];
}

export default User;
