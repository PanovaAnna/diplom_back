import {Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import {UsersService} from './users.service';
import {PaymentDataRequestDto} from "./dto/PaymentData.request.dto";
import {ApiOperation, ApiTags} from "@nestjs/swagger";

@ApiTags("Пользователи")
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({summary: "Получение ссылки для оплаты"})
  @Post("/paymentData/:id")
  async getPaymentData(
      @Param("id") id : string,
      @Body("cart") cart : PaymentDataRequestDto[],
      @Body("com") comment : string,
      @Body("bonuses") bonuses : number,
      @Body("promo") promo : string,
      @Body("promoValue") promoValue : number,
  ) {
    return await this.usersService.getPaymentData(id, cart, comment, bonuses,promo, promoValue)
  }

  @ApiOperation({summary: "Создание заказа"})
  @Post("/createOrder")
  async createOrderWithLatePayment(@Body() dto : CreateOrderRequestDto) {
    return this.usersService.createOrderWithLatePayment(dto)
  }

  @ApiOperation({summary: "Получение пользователя по telegram id"})
  @Get("/get/:id")
  async getUser(@Param("id") id : string) {
    return this.usersService.getUser(id)
  }

  @ApiOperation({summary: "Получение заказа по id"})
  @Get("/order/:id")
  async getOrder(@Param("id") id : string) {
    return this.usersService.getOrder(id)
  }

  @ApiOperation({summary: "Обновление заказа по id"})
  @Put("/order/:id")
  async updateOrder(@Param("id") id : string, @Body("state") state : string) {
    return this.usersService.updateOrder(state,+id)
  }

  @ApiOperation({summary: "Получение всех заказов"})
  @Get("/orders")
  async getOrders() {
    return this.usersService.getOrders()
  }

  @ApiOperation({summary: "Получение всех заказов"})
  @Get("/bonusPromo/:id")
  async getBonusPromo(@Param("id") id : string) {
    return this.usersService.getBonusPromo(+id)
  }

  @ApiOperation({summary: "Получение бонусных промокодов пользователя"})
  @Post("/bonuses/:id")
  async getBonuses(@Param("id") id : string, @Body("saloons") saloons : number[]) {
    return await this.usersService.getBonuses(id,saloons)
  }

  @ApiOperation({summary: "Рассылка"})
  @Post("/distribution")
  async distribution(@Body("msg") msg : string, @Body("id") id : number) {
    return await this.usersService.distribution(msg, id)
  }
}
