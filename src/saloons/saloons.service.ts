import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Saloon} from "./entities/saloon.entity";
import {SaloonCategory} from "./entities/category-saloon.entity";
import {saloonMapper} from "../mappers/saloonMapper";
import {Dish} from "../dishes/entities/dish.entity";
import {DishCategory} from "../dishes/entities/dish-category.entity";
import {GetAllSaloonsReturnDto} from "./dto/get-all.return.dto";


@Injectable()
export class SaloonsService {

    constructor(
        @InjectModel(Saloon) private saloonRepository: typeof Saloon,
        @InjectModel(SaloonCategory) private saloonCategoryRepository: typeof SaloonCategory,
    ) {
    }

    async getAll() : Promise<GetAllSaloonsReturnDto> {
        const {saloons, categories : namesCategories} = saloonMapper.toDtoGetAll(
            await this.saloonRepository.findAll({
                include: [{
                    model: SaloonCategory,
                    attributes: ['name', 'image'],
                    through: {attributes: []}
                }, Dish]
            })

        )

        const categories = await this.saloonCategoryRepository.findAll({where: {name : namesCategories}})

        return {
            categories : categories.map(c => {return {name : c.name, image : c.image}}),
            saloons
        }
    }

    async getOne(id: string) {
        const data = await this.saloonRepository.findByPk(+id, {include: [{model: Dish, include: [DishCategory]}]})

        return saloonMapper.toDtoGetOne(data)
    }
}
