import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Dish} from "./entities/dish.entity";

@Injectable()
export class DishesService {

    constructor(@InjectModel(Dish) private dishRepository: typeof Dish) {
    }
}