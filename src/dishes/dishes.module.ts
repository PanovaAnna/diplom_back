import { Module } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { DishesController } from './dishes.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Dish} from "./entities/dish.entity";
import {Saloon} from "../saloons/entities/saloon.entity";

@Module({
  controllers: [DishesController],
  providers: [DishesService],
  imports: [
      SequelizeModule.forFeature([Dish])
  ]
})
export class DishesModule {}
