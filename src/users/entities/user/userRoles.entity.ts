import {Column, ForeignKey, Model, Table} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import {User} from "./user.entity";
import {UserRole} from "./role.entity";

interface CreationProps {
    userId:number;
    roleId:number;
}

@Table({tableName: "users_roles", createdAt: false, updatedAt: false})
export class UsersRoles extends Model<UsersRoles, CreationProps> {

    @Column({type: DataTypes.INTEGER, unique: true, autoIncrement: true, primaryKey: true, allowNull: false})
    id: number;
    @ForeignKey(() => User)
    @Column({type: DataTypes.INTEGER, field: 'user_id', allowNull: false})
    userId: number;
    @ForeignKey(() => UserRole)
    @Column({type: DataTypes.INTEGER, field: 'role_id', allowNull: false})
    roleId: number;
}
