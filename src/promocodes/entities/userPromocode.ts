import {Column, ForeignKey, Model, Table, BelongsTo} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import {Promocode} from "./promocodes.entity";
import {User} from "../../users/entities/user/user.entity";

interface CreationProps {
    promocodeKey:string;
    userId:number;
}

@Table({tableName: "users_promocodes", createdAt: false, updatedAt: false})
export class UserPromocode extends Model<UserPromocode, CreationProps> {

    @Column({type: DataTypes.INTEGER, unique: true, autoIncrement: true, primaryKey: true, allowNull: false})
    id: number;
    @ForeignKey(() => Promocode)
    @Column({type: DataTypes.STRING, field: 'promocode_key', allowNull: false})
    promocodeKey: string;
    @ForeignKey(() => User)
    @Column({type: DataTypes.INTEGER, field: 'user_id', allowNull: false})
    userId: number;
}
