import {Column, HasMany, Model, Table} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import {Order} from "./order.entity";

interface CreationProps {
    name : string,
}

@Table({tableName: "order_states", createdAt: false, updatedAt: false})
export class OrderState extends Model<OrderState, CreationProps> {

    @Column({type: DataTypes.INTEGER, unique: true, autoIncrement: true, primaryKey: true, allowNull: false})
    id: number;
    @Column({type: DataTypes.STRING, allowNull: false})
    name: string;

    @HasMany(() => Order)
    orders: Order[];
}
