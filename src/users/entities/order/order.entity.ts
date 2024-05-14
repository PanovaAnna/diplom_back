import {BelongsTo, BelongsToMany, Column, ForeignKey, Model, Table} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import {Dish} from "../../../dishes/entities/dish.entity";
import {OrderDish} from "./orderDishes";
import {User} from "../user/user.entity";
import {OrderState} from "./orderState.entity";
import {Promocode} from "../../../promocodes/entities/promocodes.entity";

interface CreationProps {
    name? : string,
    address?: string,
    paymentType?: string,
    comment?:string,
    surrender?: string,
    userId : number,
    fullPrice : number,
    stateId : number,
    bonuses: number
    createdAt: string,
    promocodeId : string,
    bonusPromocodeId : string
}

@Table({tableName: "orders", createdAt: false, updatedAt: false})
export class Order extends Model<Order, CreationProps> {

    @Column({type: DataTypes.INTEGER, unique: true, autoIncrement: true, primaryKey: true, allowNull: false})
    id: number;
    @Column({type: DataTypes.STRING, allowNull: true})
    name: string;
    @Column({type: DataTypes.STRING, allowNull: true})
    address: string;
    @Column({type: DataTypes.STRING, allowNull: true})
    telephone: string;
    @Column({type: DataTypes.STRING, allowNull: true})
    paymentType: string;
    @Column({type: DataTypes.STRING, allowNull: true})
    comment: string;
    @Column({type: DataTypes.INTEGER, allowNull: true})
    surrender: number;
    @Column({type: DataTypes.INTEGER, field: 'full_price',allowNull: true})
    fullPrice: number;
    @Column({type: DataTypes.INTEGER, field: 'bonuses',allowNull: true})
    bonuses: number;
    @Column({type: DataTypes.BOOLEAN, field: 'is_paid', allowNull: false, defaultValue: false})
    isPaid: boolean;
    @Column({type: DataTypes.STRING,allowNull: false})
    createdAt:string;

    @BelongsToMany(() => Dish, () => OrderDish)
    dishes: Dish[]

    @ForeignKey(() => User)
    @Column({type: DataTypes.INTEGER, field: 'user_id', allowNull: false})
    userId: number;
    @BelongsTo(() => User)
    user : User;

    @ForeignKey(() => OrderState)
    @Column({type: DataTypes.INTEGER, field: 'state_id', allowNull: false})
    stateId: number;
    @BelongsTo(() => OrderState)
    state : OrderState;

    @ForeignKey(() => Promocode)
    @Column({type: DataTypes.STRING, field: 'promocode', allowNull: true})
    promocodeId: string;
    @BelongsTo(() => Promocode)
    promocode : Promocode;
}
