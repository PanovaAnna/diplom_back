import {Injectable} from '@nestjs/common';
import {TelegramHandler} from "../telegram/TelegramHandler";
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./entities/user/user.entity";
import {PaymentDataRequestDto} from "./dto/PaymentData.request.dto";
import {Order} from "./entities/order/order.entity";
import {OrderDish} from "./entities/order/orderDishes";
import {OrderState} from "./entities/order/orderState.entity";
import {Dish} from "../dishes/entities/dish.entity";
import {usersMapper} from "../mappers/usersMapper";
import {Saloon} from "../saloons/entities/saloon.entity";
import {PromocodesService} from "../promocodes/promocodes.service";
import {Promocode} from "../promocodes/entities/promocodes.entity";
import {UserRole} from "./entities/user/role.entity";
import {toEscapeMSg} from "../utils/ToEscapeString";

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User) private readonly userRepository : typeof User,
        @InjectModel(Order) private readonly orderRepository : typeof Order,
        @InjectModel(OrderDish) private readonly orderDishRepository : typeof OrderDish,
        @InjectModel(OrderState) private readonly orderStateRepository : typeof OrderState,
        @InjectModel(Saloon) private readonly saloonRepository : typeof Saloon,
        @InjectModel(Promocode) private readonly promoRepository : typeof Promocode,
        private readonly telegram : TelegramHandler,
        private readonly promocodeService : PromocodesService,
    ) {
    }

    async createOrderWithLatePayment(data : CreateOrderRequestDto) {

        const {id : stateId} = await this.orderStateRepository.findOne({where:{name:"Готовится"}})

        await this.orderRepository.update({
            name : data.name,
            telephone:data.telephone,
            address : data.address,
            surrender : data.surrender,
            paymentType: data.paymentType,
            stateId,
        }, {where: {id:data.orderId}})

        const dishes = await this.orderDishRepository.findAll({where : {orderId: data.orderId}, include: [{model: Dish, include: [Saloon],attributes:['name', "price"]}]})
        const order = await this.orderRepository.findByPk(data.orderId, {include: [User]})

        let bonuses = 0;
        const orderPrice = order.user.bonusQuantity < order.bonuses ? order.fullPrice - order.user.bonusQuantity : order.fullPrice - order.bonuses
        const coofRealPrice =
            (order.user.bonusQuantity < order.bonuses ? order.fullPrice - order.user.bonusQuantity : order.fullPrice - order.bonuses) / order.fullPrice

        for (const dish of dishes) {
            bonuses += Math.ceil(dish.dish.price * dish.amount * (dish.dish.saloon.bonus_factor / 100))
        }

        bonuses = Math.round(bonuses * coofRealPrice)

        await this.userRepository.update({
            name : data.name,
            telephone:data.telephone,
            address: data.address,
            bonusQuantity: bonuses + order.user.bonusQuantity - order.bonuses
        }, {where: {telegramId: data.telegramId}})

        const promoData = order.promocodeId ? await this.promoRepository.findByPk(order.promocodeId) : null
        const promocode = await this.promocodeService.createPromoWithRandom(order.userId)

        this.telegram.answerWebAppQuery({
            order: dishes.map(dish => {
                return {name : dish.dish.name, amount: dish.amount}
            }),
            telephone : order.telephone,
            name : order.name,
            address : order.address,
            queryId : data.queryId,
            price : order.fullPrice,
            com : order.comment,
            username: data.username,
            orderTime : order.createdAt,
            telegramId : order.user.telegramId,
            paymentMsg : `${data.surrender ? '💵' : '💳'} Тип оплаты: ${data.paymentType} ${data.surrender ? `, сдача с ${data.surrender}₽` : ''}`,
            finalPrice: orderPrice,
            bonusesUsed: order.bonuses,
            bonusesAccrued: bonuses,
            promocode,
            promoValue: promoData?.value
        })
    }

    async getPaymentData(id : string, cart : PaymentDataRequestDto[], comment : string, bonuses : number,promo:string, promoValue: number) {
        const user = await this.userRepository.findOne({where : {telegramId: id}})
        let price = 0;

        for (const order of cart) {
            price += order.count * order.price
        }

        const {id : stateId} = await this.orderStateRepository.findOne({where:{name:"Оплачивается"}})
        const {id : orderId} = await this.orderRepository.create({userId : user.id, promocodeId: promo ? promo : null,fullPrice: price, bonuses,stateId: stateId, comment: comment ? comment : null, createdAt: new Date(new Date().setHours(new Date().getHours() + 3)).toISOString().slice(0, 19).replace('T', ' ')})
        await this.orderDishRepository.bulkCreate(cart.map(order => {
            return { dishId : order.id, orderId, amount : order.count }
        }))

        return {
            name : user.name,
            telephone : user.telephone,
            address : user.address,
            url : await this.telegram.createPaymentLink(cart, orderId, user.id, bonuses, promoValue),
            order : orderId
        }
    }

    async getUser(id : string) {
        const user = await this.userRepository.findOne({
            where: {telegramId: +id},
            include: {model: Order, include: [OrderState]}
        })
        return usersMapper.toDtoUser(user)
    }

    async getOrder(id : string) {
        const order = await this.orderRepository.findByPk(+id, {include: [Dish, Promocode]})
        const dishes = await this.orderDishRepository.findAll({where: {orderId: +id}, include: {model: Dish, include: [Saloon]}})
        return usersMapper.toDtoOrder(order, dishes)
    }

    async getOrders() {
        const orders = await this.orderRepository.findAll({include : [OrderState]})
        const states = await this.orderStateRepository.findAll()
        return usersMapper.toDtoOrders(orders, states)
    }

    async getBonuses(id : string, saloonsIds : number[]) {
        const {bonusQuantity : bonuses} = await this.userRepository.findOne({where: {telegramId:+id}})
        const saloons = await this.saloonRepository.findAll({where: {id: saloonsIds}})
        return {
            bonuses : bonuses < 0 ? 0 : bonuses,
            factors: saloons.map(saloon => {
                return {
                    id: saloon.id,
                    factor: saloon.bonus_factor
                }
            })
        }
    }

    async updateOrder(state: string,id : number) {
        const orderState = await this.orderStateRepository.findOne({where: {name: state}})
        await this.orderRepository.update({stateId: orderState.id}, {where: {id}})
        const {user} = await this.orderRepository.findOne({where: {id}, include: [User]})
        this.telegram.updateOrderState(id, state, user.telegramId)
    }

    async getBonusPromo(id : number) {
        const {promocodes} = await this.userRepository.findOne({where: {telegramId: id}, include: [Promocode]})
        return promocodes?.length ? promocodes.map(promo => {
            return {
                promo : promo.KEY,
                value : promo.value
            }
        }) : null
    }

    async distribution(msg : string, telegramId : number) {
        const user = await this.userRepository.findOne({where: {telegramId}, include: [UserRole]})
        if (!user.roles.find(role => role.name === 'CMM')) return "Недостаточно прав!"

        const users = await this.userRepository.findAll()
        const message = toEscapeMSg(msg)

        if (!message) return "Сообщение пустое!"

        for (const user of users) {
            await this.telegram.telegram.sendMessage(user.telegramId, message)
        }
        return "Успех!"
    }
}
