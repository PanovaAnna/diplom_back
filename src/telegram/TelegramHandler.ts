import {Markup, session, Telegraf, Telegram} from "telegraf";
// @ts-ignore
import {BaseScene, Stage} from "telegraf/scenes";
import * as process from "process";
import {Injectable} from "@nestjs/common";
import {PaymentDataRequestDto} from "../users/dto/PaymentData.request.dto";
import {InjectModel} from "@nestjs/sequelize";
import {User} from "../users/entities/user/user.entity";
import {Order} from "../users/entities/order/order.entity";
import {OrderState} from "../users/entities/order/orderState.entity";
import {UserRole} from "../users/entities/user/role.entity";
import {Dish} from "../dishes/entities/dish.entity";
import {OrderDish} from "../users/entities/order/orderDishes";
import {toEscapeMSg} from "../utils/ToEscapeString";
import {UsersRoles} from "../users/entities/user/userRoles.entity";
import {Saloon} from "../saloons/entities/saloon.entity";
import {PromocodesService} from "../promocodes/promocodes.service";
import {Promocode} from "../promocodes/entities/promocodes.entity";

interface WebAppQueryProps {
    paymentMsg: string,
    orderTime: string,
    username?: string,
    order: { name: string, amount: number }[],
    telegramId?: number,
    price: number,
    finalPrice: number,
    name: string,
    telephone: string,
    address: string,
    com: null | string,
    queryId?: string,
    bonusesAccrued: number,
    bonusesUsed: number,
    promocode: { value: number, promo: string } | null,
    promoValue: number | null
}

@Injectable()
export class TelegramHandler {
    bot: Telegraf;
    telegram: Telegram;

    constructor(
        @InjectModel(User) readonly userRepository: typeof User,
        @InjectModel(Order) private readonly orderRepository: typeof Order,
        @InjectModel(OrderState) private readonly orderStateRepository: typeof OrderState,
        @InjectModel(UserRole) private readonly userRoleRepository: typeof UserRole,
        @InjectModel(UsersRoles) private readonly usersRolesRepository: typeof UsersRoles,
        @InjectModel(OrderDish) private readonly orderDishRepository: typeof OrderDish,
        @InjectModel(Promocode) private readonly promoRepository: typeof Promocode,
        private readonly promocodeService: PromocodesService,
    ) {
        this.bot = new Telegraf(process.env.BOT_TOKEN)
        this.telegram = new Telegram(process.env.BOT_TOKEN)


        const stage = new Stage([this.supportScene()])
        this.bot.use(session())
        this.bot.use(stage.middleware())
        this.botHandlers()
    }

    supportScene() {
        const support = new BaseScene('support')
        support.enter(async (ctx) => {
            try {
                await ctx.reply('📝 Задайте интересующий Вас вопрос :')
            } catch (e) {
                console.log(e)
            }
        })
        support.on('message', async (ctx) => {
            try {
                if (!ctx.message.text) return ctx.reply('⛔ Пожалуйста отправьте Ваш вопрос в текстовом виде!')

                const username = ctx.message.from.username ? toEscapeMSg(ctx.message.from.username) : null
                const text = toEscapeMSg(ctx.message.text)

                await ctx.telegram.sendMessage(process.env.SUPPORT_GROUP, `✉ \\|\\ Новый вопрос\nОт: @${username ? username : 'Никнейма нету'}\nВопрос: ${"`" + text + "`"}\n\n📝 Чтобы ответить на вопрос введите\n` + '`/ответ ' + ctx.chat.id + '`' + '  `Ваш ответ`', {parse_mode: 'MarkdownV2'})
                await ctx.reply('✉ Ваш вопрос был отослан! Ожидайте ответа от тех. поддержки')
                ctx.scene.leave()
            } catch (e) {
                console.log(e)
            }
        })
        return support
    }

    async createPaymentLink(cart: PaymentDataRequestDto[], orderId: number, userId: number, discount: number, promo: number) {

        let price = 0;

        for (const order of cart) {
            price += order.count * order.price
        }

        return await this.telegram.createInvoiceLink({
            title: "DeliveryDubna | Оплата",
            description: "Оплачивание заказа",
            payload: JSON.stringify({order: orderId, user: userId}),
            provider_token: process.env.BOT_PAYMENT_TOKEN,
            currency: "RUB",
            prices: [...cart.map(order => {
                return {label: order.name, amount: order.count * order.price * 100}
            }), {label: "Скидка бонусами", amount: -discount * 100}, {
                label: "Скидка промокодом",
                amount: -Math.ceil(((price - discount) * promo * 100))
            }],
            need_name: true,
            need_phone_number: true,
            need_shipping_address: true
        })
    }

    private botHandlers() {
        this.bot.start(async (ctx) => {
            try {
                if (ctx.chat.type === 'group') return
                await ctx.reply("Аллилуйя аппетита и вкусовых ощущений! 🌶🛵💫\n" +
                    "\n" +
                    "Встречайте, DeliveryDubna - где каждый байт, это праздник! Мы не просто доставляем еду, мы доставляем улыбки, запечатленные во вкусах и ароматах нашей кухни!\n" +
                    "\n" +
                    "И вот что мы можем вам предложить:\n" +
                    "\n" +
                    "💖 Разнообразие блюд - от классического бургера до экзотических суши, у нас всё, чтобы облегчить ваш выбор!\n" +
                    "📌 Реал-тайм трекинг - следите за статусом вашего заказа, как за первыми шагами первенца.\n" +
                    "🎁 Специальные предложения, раздачи и акции – потому что каждый день дарим немножко праздника.\n",
                    Markup.inlineKeyboard([
                        [
                            Markup.button.webApp("Заказ еды 🍗", process.env.CLIENT_URL),
                        ]
                    ]))

                await ctx.reply("Готовы к старту? Жмите \"Заказ еды\" и выбирайте, что вашей душе угодно!\n" +
                    "\n" +
                    "Ваш гид по миру изысканных вкусов,\n" +
                    "DeliveryDubna 🥗🤹", Markup.keyboard([
                    ["✉ Задать вопрос"]
                ]).oneTime().resize())

                const chatId = ctx.message.from.id

                const user = await this.userRepository.findOne({where: {telegramId: chatId}})

                if (!user) {
                    const {id} = await this.userRoleRepository.findOne({where: {name: "USER"}})
                    const newUser = await this.userRepository.create({
                        telegramId: chatId,
                        name: ctx.message.from.first_name,
                        createdAt: new Date(new Date().setHours(new Date().getHours() + 3)).toISOString().slice(0, 19).replace('T', ' ')
                    })
                    await this.usersRolesRepository.create({userId: newUser.id, roleId: id})
                }
            } catch (e) {
                console.log(e)
            }
        })

        this.bot.hears('✉ Задать вопрос', async (ctx) => {
            try {
                if (ctx.chat.id !== +process.env.ORDER_GROUP) {
                    // @ts-ignore
                    ctx.scene.enter("support")
                }

            } catch (e) {
                console.log(e)
            }
        })

        this.bot.hears(/\ответ /, async ctx => {
            try {
                if (ctx.chat.id === +process.env.SUPPORT_GROUP) {
                    await ctx.telegram.sendMessage(ctx.message.text.split(" ")[1], '✉ Новое уведомление\\!\\\nОтвет от тех\\.\\ поддержки:\n\n`' + toEscapeMSg(ctx.message.text.substring(17)) + '`', {parse_mode: 'MarkdownV2'})
                }
            } catch (e) {
                console.log(e)
            }
        })

        this.bot.command("admin", async (ctx) => {
            try {
                if (ctx.chat.type !== "group") {
                    const user = await this.userRepository.findOne({
                        where: {telegramId: ctx.from.id},
                        include: [UserRole]
                    })

                    if (!user) return

                    if (!!user.roles.find(role => role.name === "ADMIN")) {
                        ctx.reply("Админ панель:", Markup.inlineKeyboard([Markup.button.webApp("CLICK", process.env.CLIENT_URL + "/admin")]))
                    }
                }
            } catch (e) {
                console.log(e)
            }
        })

        this.bot.on("pre_checkout_query", (ctx) => {
            ctx.answerPreCheckoutQuery(true)
        })

        this.bot.on("successful_payment", async (ctx) => {
            const data = ctx.message.successful_payment
            const address = data.order_info.shipping_address
            const payload: { order: number, user: number } = JSON.parse(data.invoice_payload)

            const userInfo = {
                name: data.order_info.name,
                address: `${address.state}, ${address.city}, ${address.street_line1}, ${address.street_line2}`,
                telephone: data.order_info.phone_number,
            }

            const {id: stateId} = await this.orderStateRepository.findOne({where: {name: "Готовится"}})

            await this.orderRepository.update({
                ...userInfo,
                isPaid: true,
                stateId: stateId,
            }, {where: {id: payload.order}})

            const order = await this.orderRepository.findByPk(payload.order, {include: [User]})
            const dishes = await this.orderDishRepository.findAll({
                where: {orderId: payload.order},
                include: [{model: Dish, include: [Saloon]}]
            })

            let bonuses = 0;
            const orderPrice = order.user.bonusQuantity < order.bonuses ? order.fullPrice - order.user.bonusQuantity : order.fullPrice - order.bonuses
            const coofRealPrice =
                (order.user.bonusQuantity < order.bonuses ? order.fullPrice - order.user.bonusQuantity : order.fullPrice - order.bonuses) / order.fullPrice

            for (const dish of dishes) {
                bonuses += Math.ceil(dish.dish.price * dish.amount * (dish.dish.saloon.bonus_factor / 100))
            }

            bonuses = Math.round(bonuses * coofRealPrice)

            await this.userRepository.update({
                ...userInfo,
                bonusQuantity: bonuses + order.user.bonusQuantity - order.bonuses
            }, {where: {id: payload.user}})

            const promoData = order.promocodeId ? await this.promoRepository.findByPk(order.promocodeId) : null
            const promocode = await this.promocodeService.createPromoWithRandom(order.userId)

            this.answerWebAppQuery({
                order: dishes.map(dish => {
                    return {name: dish.dish.name, amount: dish.amount}
                }),
                telephone: order.telephone,
                name: order.name,
                address: order.address,
                price: order.fullPrice,
                finalPrice: orderPrice,
                com: order.comment,
                telegramId: ctx.message.from.id,
                username: ctx.message.from.username,
                orderTime: order.createdAt,
                paymentMsg: "💳 Оплачено онлайн",
                bonusesAccrued: bonuses,
                bonusesUsed: order.bonuses,
                promocode,
                promoValue: promoData?.value
            })
        })

        this.bot.launch()
    }

    async updateOrderState(id: number, state: string, telegramId: number) {
        const msg = '📦 Ваш заказ ' + '`#' + id + '`' + ' сменил состояние\\. Теперь он:' + ' `' + state + '`'
        this.telegram.sendMessage(telegramId, msg, {parse_mode: 'MarkdownV2'})
    }

    async answerWebAppQuery({
                                order,
                                name,
                                address,
                                com,
                                price,
                                queryId,
                                telephone,
                                paymentMsg,
                                telegramId,
                                username,
                                orderTime,
                                bonusesAccrued,
                                bonusesUsed,
                                finalPrice,
                                promocode,
                                promoValue
                            }: WebAppQueryProps) {
        let msgText = '📦 Заказ оформлен:\n'


        order.forEach(order => {
            msgText += `---------------------------\n🔹 Название: ${order.name}, Количество : ${order.amount}\n`
        })

        msgText +=
            `---------------------------
Данные о доставке:
📗 Имя: ${name}
📞 Телефон: ${telephone}
📮 Адрес: ${address}
⏰ Время заказа: ${orderTime}
${paymentMsg}\n
🔼 Бонусов начислено: ${bonusesAccrued}
🔽 Бонусов использовано: ${bonusesUsed}
${promoValue ? `💰 Скидка промокода: ${promoValue}%` : ""}
💵 Стоимость: ${price}₽\n
💰 Итоговая стоимость: ${promoValue ? finalPrice - Math.ceil(finalPrice * promoValue / 100) : finalPrice}₽
${com ? `✉ Комментарий : ${com}` : ''}\n`

        try {
            let tempMsgText = msgText

            if (promocode) msgText += `\n🎫 Вам выпал промокод со скидкой ${promocode.value}% : ${promocode.promo}`

            if (queryId) await this.telegram.answerWebAppQuery(queryId, {
                type: 'article',
                id: queryId,
                title: 'Покупка',
                input_message_content: {
                    message_text: msgText
                }
            })
            else if (telegramId) await this.telegram.sendMessage(telegramId, msgText)

            tempMsgText += `\n📗 Заказчик: @${username} id: ${telegramId}`

            await this.telegram.sendMessage(process.env.ORDER_GROUP, tempMsgText)
        } catch (e) {
            console.log(e)
        }
    }
}

