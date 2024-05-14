import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {DishesModule} from './dishes/dishes.module';
import {Dish} from "./dishes/entities/dish.entity";
import {SaloonsModule} from './saloons/saloons.module';
import {Saloon} from "./saloons/entities/saloon.entity";
import {SaloonCategory} from "./saloons/entities/category-saloon.entity";
import {DishCategory} from "./dishes/entities/dish-category.entity";
import {ConfigModule} from "@nestjs/config";
import * as process from "process";
import {SaloonsCategories} from "./saloons/entities/saloons-categories.entity";
import {UsersModule} from './users/users.module';
import {User} from "./users/entities/user/user.entity";
import {Order} from "./users/entities/order/order.entity";
import {OrderDish} from "./users/entities/order/orderDishes";
import {OrderState} from "./users/entities/order/orderState.entity";
import {UserRole} from "./users/entities/user/role.entity";
import {UsersRoles} from "./users/entities/user/userRoles.entity";
import {Promocode} from "./promocodes/entities/promocodes.entity";
import {UserPromocode} from "./promocodes/entities/userPromocode";
import { PromocodesModule } from './promocodes/promocodes.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env"
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            schema: process.env.POSTGRES_SCHEMA,
            models: [Dish, Saloon, SaloonCategory, DishCategory, SaloonsCategories, User, Order, OrderDish, OrderState, UserRole, UsersRoles, Promocode, UserPromocode],
            autoLoadModels: true,
            logging: false,
            sync: {
                alter: true
            },
            dialectOptions: {
                ssl: true,
                timezone: null
            },

        }),
        DishesModule,
        SaloonsModule,
        UsersModule,
        PromocodesModule,
    ],
})
export class AppModule {
}
