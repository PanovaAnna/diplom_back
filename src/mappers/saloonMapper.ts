import {Saloon} from "../saloons/entities/saloon.entity";
import {SaloonAllDto} from "../saloons/dto/get-all.return.dto";
import {GetOneSaloonReturnDto} from "../saloons/dto/get-one.return.dto";

class SaloonMapper {
    toDtoGetAll(saloons: Saloon[]) : {categories : string[], saloons : SaloonAllDto[]}  {

        let tempCategories : string[] = [];

        const tempSaloons = saloons.filter(saloon => saloon.dishes.length).map((saloon): SaloonAllDto => {

            const categories = saloon.categories.map(category => category.name)
            tempCategories.push(...categories)

            return {
                id: saloon.id,
                image: saloon.image,
                categories: categories,
                info: saloon.info,
                name: saloon.name,
                price: saloon.price,
                rating: saloon.rating,
                rating_quantity: saloon.rating_quantity
            }
        })

        return {
            categories: tempCategories,
            saloons : tempSaloons
        }
    }

    toDtoGetOne(saloon: Saloon): GetOneSaloonReturnDto {
        const dishes = saloon.dishes.map(dish => {
            delete dish.dataValues.saloonId
            delete dish.dataValues.categoryId
            return {...dish.dataValues, category: dish.category.name}
        })

        const tempCategories = [...new Set(dishes.map(dish=> dish.category))]
        const categories = tempCategories.map(category => {
            return {name : category, image : saloon.dishes.find(dish => dish.category.name === category).category.image}
        })

        return {
            saloon: {
                image: saloon.image,
                info: saloon.info,
                name: saloon.name,
                price: saloon.price,
                rating: saloon.rating,
                rating_quantity: saloon.rating_quantity,
            },
            dishes,
            categories : categories
        }
    }
}

export const saloonMapper = new SaloonMapper();