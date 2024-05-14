import {BelongsToMany, Column, HasMany, Model, Table} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import {Dish} from "../../dishes/entities/dish.entity";
import {SaloonCategory} from "./category-saloon.entity";
import {SaloonsCategories} from "./saloons-categories.entity";

interface CreationProps {
    name: string;
    image: string;
    price: number;
    rating: number;
    rating_quantity: number;
    info: string;
    bonus_factor: number;
}

@Table({tableName: "saloons", createdAt: false, updatedAt: false})
export class Saloon extends Model<Saloon, CreationProps> {

    @Column({type: DataTypes.INTEGER, unique: true, autoIncrement: true, primaryKey: true, allowNull: false})
    id: number;
    @Column({type: DataTypes.STRING, allowNull: false})
    name: string;
    @Column({type: DataTypes.STRING, allowNull: true})
    image: string;
    @Column({type: DataTypes.SMALLINT, allowNull: true})
    price: number;
    @Column({type: DataTypes.FLOAT(1), allowNull: true})
    rating: number;
    @Column({type: DataTypes.INTEGER, allowNull: true})
    rating_quantity: number;
    @Column({type: DataTypes.TEXT, allowNull: true})
    info: string;
    @Column({type: DataTypes.SMALLINT, allowNull: true}) //TODO сделать обязательным полем
    bonus_factor: number

    @BelongsToMany(() => SaloonCategory, () => SaloonsCategories)
    categories: SaloonCategory[]

    @HasMany(() => Dish)
    dishes: Dish[]
}
