import {BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, Table} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import {Order} from "../order/order.entity";
import {UserRole} from "./role.entity";
import {SaloonCategory} from "../../../saloons/entities/category-saloon.entity";
import {SaloonsCategories} from "../../../saloons/entities/saloons-categories.entity";
import {UsersRoles} from "./userRoles.entity";
import {Promocode} from "../../../promocodes/entities/promocodes.entity";

interface CreationProps {
    name:string
    telegramId:number
    address:string
    bonusQuantity: number,
    createdAt
}

@Table({tableName:"users", createdAt: false, updatedAt: false})
export class User extends Model<User,CreationProps> {

    @Column({type: DataTypes.INTEGER, unique: true, autoIncrement: true, primaryKey: true, allowNull: false})
    id:number;
    @Column({type: DataTypes.STRING, allowNull: true})
    name:string;
    @Column({type: DataTypes.INTEGER, allowNull: false, field : 'telegram_id'})
    telegramId:number;
    @Column({type: DataTypes.STRING, allowNull: true})
    address:string;
    @Column({type: DataTypes.STRING, allowNull: true})
    telephone:string;
    @Column({type: DataTypes.INTEGER, allowNull: false,field: 'bonus_quantity', defaultValue: 0})
    bonusQuantity:number;
    @Column({type: DataTypes.STRING, allowNull: false})
    createdAt:Date;

    @BelongsToMany(() => UserRole, () => UsersRoles)
    roles: UserRole[]

    @HasMany(() => Order)
    orders : Order[];

    @HasMany(() => Promocode)
    promocodes : Promocode[];
}
