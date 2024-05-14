import {Module} from '@nestjs/common';
import {SaloonsService} from './saloons.service';
import {SaloonsController} from './saloons.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Saloon} from "./entities/saloon.entity";
import {SaloonCategory} from "./entities/category-saloon.entity";

@Module({
  controllers: [SaloonsController],
  providers: [SaloonsService],
  imports: [
      SequelizeModule.forFeature([Saloon, SaloonCategory])
  ]
})
export class SaloonsModule {}
