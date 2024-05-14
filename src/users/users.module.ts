import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {TelegramHandler} from "../telegram/TelegramHandler";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./entities/user/user.entity";
import {Order} from "./entities/order/order.entity";
import {OrderDish} from "./entities/order/orderDishes";
import {OrderState} from "./entities/order/orderState.entity";
import {UserRole} from "./entities/user/role.entity";
import {UsersRoles} from "./entities/user/userRoles.entity";
import {Saloon} from "../saloons/entities/saloon.entity";
import {Promocode} from "../promocodes/entities/promocodes.entity";
import {PromocodesService} from "../promocodes/promocodes.service";
import {UserPromocode} from "../promocodes/entities/userPromocode";

@Module({
  controllers: [UsersController],
  providers: [UsersService, TelegramHandler, PromocodesService],
  imports : [SequelizeModule.forFeature([User, Order, OrderDish, OrderState, UserRole, UsersRoles, Saloon, Promocode, UserPromocode])]
})
export class UsersModule {}
