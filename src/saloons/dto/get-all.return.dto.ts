import {ApiProperty} from "@nestjs/swagger";

export class SaloonAllDto {
    id:number;
    name: string;
    image: string;
    price: number;
    rating: number;
    rating_quantity: number;
    info: string;
    categories:string[];
}
export class GetAllSaloonsReturnDto {
    @ApiProperty({example: [
            {name : "Балкон", image : "path/to/image", price : 2, rating : 4.3, rating_quantity: 3782, info : 'Улица Маяковского'},
            {name : "Оружие", image : "path/to/image", price : 1, rating : 4.4, rating_quantity: 3121, info : 'Улица Пушкина'}
        ], description : 'Информация о ресторанах'})
    saloons : SaloonAllDto[];
    @ApiProperty({example: [
            {name : 'Пицца', image : 'path/to/image'},
            {name : 'Роллы', image : 'path/to/image'}
        ], description : 'Категории и их картинки'})
    categories : {name : string, image : string}[];
}