import {BelongsTo, Column, ForeignKey, Model, Table} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import {Order} from "./order.entity";
import {Dish} from "../../../dishes/entities/dish.entity";

interface CreationProps {
    orderId:number;
    dishId:number;
    amount:number;
}

@Table({tableName: "order_dishes", createdAt: false, updatedAt: false})
export class OrderDish extends Model<OrderDish, CreationProps> {

    @Column({type: DataTypes.INTEGER, unique: true, autoIncrement: true, primaryKey: true, allowNull: false})
    id: number;
    @ForeignKey(() => Order)
    @Column({type: DataTypes.INTEGER, field: 'order_id', allowNull: false})
    orderId: number;
    @ForeignKey(() => Dish)
    @Column({type: DataTypes.INTEGER, field: 'dish_id', allowNull: false})
    dishId: number;
    @Column({type: DataTypes.INTEGER, allowNull: false})
    amount : number;

    @BelongsTo(() => Dish)
    dish: Dish;
}
