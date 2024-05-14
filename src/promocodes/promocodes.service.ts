import {Injectable} from '@nestjs/common';
import {User} from "../users/entities/user/user.entity";
import {InjectModel} from "@nestjs/sequelize";
import {Promocode} from "./entities/promocodes.entity";
import {UserPromocode} from "./entities/userPromocode";
import {makeRandomPromo} from "../utils/MakeRandomPromo";
import {where} from "sequelize";
import {UsePromoResponseDto} from "./dto/use.response.dto";

@Injectable()
export class PromocodesService {

    constructor(
        @InjectModel(Promocode) private readonly promoRepository : typeof Promocode,
        @InjectModel(UserPromocode) private readonly userPromoRepository : typeof UserPromocode,
        @InjectModel(User) private readonly userRepository : typeof User,
        ){}

    async checkPromo(promo : string, id : number) : Promise<UsePromoResponseDto> {
        const amountUsed = await this.userPromoRepository.count({where: {promocodeKey: promo}})

        try {
            const {maxCount} = await this.promoRepository.findByPk(promo)

            if (amountUsed >= maxCount) {
                return {state: "error", msg: "Промокод недействителен"}
            }

            const {users, value} = await this.promoRepository.findByPk(promo, {include: {all: true}})
            if (!!users.find(user => user.telegramId === id)) {
                return {state: "error", msg: "Промокод уже использован вами"}
            }

            return {state: "success", msg: value}

        } catch (e) {
            console.log(e)
            return {state: "error", msg: "Промокод не существует"}
        }
    }

    async usePromo(promo : string, id : number) {
        const checkPromo= await this.checkPromo(promo,id)
        if (checkPromo.state === 'error') return checkPromo

        const {id : userId} = await this.userRepository.findOne({where: {telegramId: id}})
        await this.userPromoRepository.create({promocodeKey: promo, userId})
        const promocode = await this.promoRepository.findOne({where: {KEY: promo}})
        if (promocode.userId) await this.promoRepository.update({userId: null}, {where: {KEY: promo}})

        return checkPromo
    }

    async createPromoWithRandom(userId: number) : Promise<{promo:string,value:number}> | null {
        const random = Math.random().toFixed(2)

        if (+random <= 0.6) {
            const promo = makeRandomPromo(12).toUpperCase()
            const value = Math.floor(Math.random() * (70 - 10 + 1) + 10)
            await this.promoRepository.create({KEY: promo, maxCount: 1, value: value, userId})
            return {
                promo,
                value
            }
        }
        else return null
    }
}
