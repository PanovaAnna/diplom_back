import {Column, Model, Table} from 'sequelize-typescript';
import {DataTypes} from "sequelize";

interface CreationProps {
    name: string;
    image: string;
}

@Table({tableName: "category-saloon", createdAt: false, updatedAt: false})
export class SaloonCategory extends Model<SaloonCategory, CreationProps> {

    @Column({type: DataTypes.INTEGER, unique: true, autoIncrement: true, primaryKey: true, allowNull: false})
    id: number;
    @Column({type: DataTypes.STRING, allowNull: false})
    name: string;
    @Column({type: DataTypes.STRING, allowNull: false})
    image: string;
}
