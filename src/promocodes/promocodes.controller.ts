import {Controller, Post, Body} from '@nestjs/common';
import {PromocodesService} from './promocodes.service';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UsePromoResponseDto} from './dto/use.response.dto'
import {UsePromoRequestDto} from "./dto/use.request.dto";
@ApiTags("Промокоды")
@Controller('promo')
export class PromocodesController {
    constructor(private readonly promocodesService: PromocodesService) {}

    @ApiOperation({summary: "Использование промокода"})
    @ApiResponse({status: "2XX", type : UsePromoResponseDto})
    @Post("/use")
    async usePromo(@Body() dto : UsePromoRequestDto) : Promise<UsePromoResponseDto> {
        return await this.promocodesService.usePromo(dto.promo.toUpperCase(),dto.id)
    }

    @ApiOperation({summary: "Проверка промокода"})
    @ApiResponse({status: "2XX", type : UsePromoResponseDto})
    @Post("/check")
    async checkPromo(@Body() dto : UsePromoRequestDto) {
        return await this.promocodesService.checkPromo(dto.promo.toUpperCase(),dto.id)
    }
}
