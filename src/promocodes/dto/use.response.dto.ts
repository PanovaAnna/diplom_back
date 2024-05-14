import {ApiProperty} from "@nestjs/swagger";

export class UsePromoResponseDto {
    @ApiProperty({example: "success", description: "Статус ответа"})
    state : string
    @ApiProperty({example : "JOI434JKJL2", description: 'Сам промокод, если ошибка, то ошибка или же значение промокода'})
    msg : string | number
}