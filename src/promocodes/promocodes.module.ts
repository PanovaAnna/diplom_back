import { Module } from '@nestjs/common';
import { PromocodesService } from './promocodes.service';
import { PromocodesController } from './promocodes.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Promocode} from "./entities/promocodes.entity";
import {UserPromocode} from "./entities/userPromocode";
import {User} from "../users/entities/user/user.entity";

@Module({
  controllers: [PromocodesController],
  providers: [PromocodesService],
  imports: [SequelizeModule.forFeature([Promocode, UserPromocode,User])],
})
export class PromocodesModule {}
