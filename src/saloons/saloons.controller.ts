import {Controller, Get, Param} from '@nestjs/common';
import {SaloonsService} from './saloons.service';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {GetAllSaloonsReturnDto} from "./dto/get-all.return.dto";
import {GetOneSaloonReturnDto} from "./dto/get-one.return.dto";

@ApiTags("Рестораны")
@Controller('saloons')
export class SaloonsController {
  constructor(private readonly saloonsService: SaloonsService) {}

  @ApiOperation({summary: "Получение всех ресторанов и их категорий"})
  @ApiResponse({status: "2XX", type : GetAllSaloonsReturnDto})
  @Get()
  async getAll() {
    return await this.saloonsService.getAll()
  }
  @ApiOperation({summary: "Получение ресторана и его блюд с их категориями"})
  @ApiResponse({status: "2XX", type : GetOneSaloonReturnDto})
  @Get(":id")
  async getOne(@Param("id") id : string) {
    return await this.saloonsService.getOne(id)
  }
}
