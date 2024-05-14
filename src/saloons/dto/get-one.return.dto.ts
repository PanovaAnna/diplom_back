import {ApiProperty} from "@nestjs/swagger";

interface Dish {
    id:number
    name:string
    image:string
    price:number
    description:string
    weight:number
    category: string
}

interface Saloon {
    name: string;
    image: string;
    price: number;
    rating: number;
    rating_quantity: number;
    info: string;
}
export class GetOneSaloonReturnDto {
    @ApiProperty({example: {name : "Балкон", image : "path/to/image", price : 2, rating : 4.3, rating_quantity: 3782, info : 'Улица Маяковского'}, description : 'Информация о ресторане'})
    saloon : Saloon
    @ApiProperty({example: {id : 2, name : "Маргарита", image : "path/to/image", price : 300, description : 'Такого вы ещё не пробовали', weight: 1000, category : 'Пицца'}, description : 'Информация о блюде'})
    dishes : Dish[]
    @ApiProperty({example: {name : 'Пицца', image : 'path/to/image'}, description : 'Категория и её картинка'})
    categories : {
        name : string,
        image : string
    }[]
}