import {Column, ForeignKey, Model, Table} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import {SaloonCategory} from "./category-saloon.entity";
import {Saloon} from "./saloon.entity";

interface CreationProps {
    categoryId:number;
    saloonId:number;
}

@Table({tableName: "saloons_categories", createdAt: false, updatedAt: false})
export class SaloonsCategories extends Model<SaloonsCategories, CreationProps> {

    @Column({type: DataTypes.INTEGER, unique: true, autoIncrement: true, primaryKey: true, allowNull: false})
    id: number;
    @ForeignKey(() => Saloon)
    @Column({type: DataTypes.INTEGER, field: 'saloon_id', allowNull: false})
    saloonId: number;
    @ForeignKey(() => SaloonCategory)
    @Column({type: DataTypes.INTEGER, field: 'category_id', allowNull: false})
    categoryId: number;
}
