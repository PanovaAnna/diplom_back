import {Column, HasMany, Model, Table} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import {User} from "./user.entity";

interface CreationProps {
    name:string
}

@Table({tableName:"roles", createdAt: false, updatedAt: false})
export class UserRole extends Model<UserRole,CreationProps> {

    @Column({type: DataTypes.INTEGER, unique: true, autoIncrement: true, primaryKey: true, allowNull: false})
    id:number;
    @Column({type: DataTypes.STRING, allowNull: false})
    name:string;
}
