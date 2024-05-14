import {ApiProperty} from "@nestjs/swagger";

export class UsePromoRequestDto {
    @ApiProperty({example: "JLKNLKNL342L", description: "Промокод"})
    promo : string
    @ApiProperty({example: 318031834, description: 'Telegram Id'})
    id : number
}