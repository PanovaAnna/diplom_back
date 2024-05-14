import {Column, Model, Table, BelongsToMany, HasMany, ForeignKey, BelongsTo} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import {User} from "../../users/entities/user/user.entity";
import {UserPromocode} from "./userPromocode";
import {Order} from "../../users/entities/order/order.entity";

interface CreationProps {
    KEY: string
    maxCount:number
    value:number,
    userId? : number
}

@Table({tableName: "promocodes", createdAt: false, updatedAt: false})
export class Promocode extends Model<Promocode, CreationProps> {

    @Column({type: DataTypes.STRING, unique: true, primaryKey: true, allowNull: false})
    KEY: string;
    @Column({type: DataTypes.SMALLINT, allowNull: false, field: "max_count"})
    maxCount: number;
    @Column({type: DataTypes.SMALLINT, allowNull: false})
    value: number;

    @BelongsToMany(() => User, () => UserPromocode)
    users: User[]

    @ForeignKey(() => User)
    @Column({type: DataTypes.INTEGER, field: 'user_id', allowNull: true})
    userId: number;
    @BelongsTo(() => User)
    user : User;
}
