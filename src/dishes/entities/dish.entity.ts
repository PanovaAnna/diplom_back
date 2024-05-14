import {BelongsTo, Column, ForeignKey, Model, Table} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import {Saloon} from "../../saloons/entities/saloon.entity";
import {DishCategory} from "./dish-category.entity";

interface CreationProps {
    name:string
    image:string
    price:number
    description:string
    weight:number
    saloonId:number
    categoryId:number
}

@Table({tableName:"dishes", createdAt: false, updatedAt: false})
export class Dish extends Model<Dish,CreationProps> {

    @Column({type: DataTypes.INTEGER, unique: true, autoIncrement: true, primaryKey: true, allowNull: false})
    id:number;
    @Column({type: DataTypes.STRING, allowNull: false})
    name:string;
    @Column({type: DataTypes.STRING, allowNull: false})
    image:string;
    @Column({type: DataTypes.SMALLINT, allowNull: false})
    price:number;
    @Column({type: DataTypes.TEXT, allowNull: false})
    description:string;
    @Column({type: DataTypes.SMALLINT, allowNull: false})
    weight:number;

    @ForeignKey(() => Saloon)
    @Column({type: DataTypes.INTEGER, field: 'saloon_id', allowNull: false})
    saloonId: number;

    @ForeignKey(() => DishCategory)
    @Column({type: DataTypes.INTEGER, field: 'category_id', allowNull: false})
    categoryId: number;

    @BelongsTo(() => Saloon)
    saloon: Saloon;
    @BelongsTo(() => DishCategory)
    category: DishCategory;
}
