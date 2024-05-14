import {User} from "../users/entities/user/user.entity";
import {Order} from "../users/entities/order/order.entity";
import {OrderDish} from "../users/entities/order/orderDishes";
import {OrderState} from "../users/entities/order/orderState.entity";

class UsersMapper {
    toDtoUser(user : User) {
        const orders = user.orders.map(order => {
            return {
                id : order.id,
                date : order.createdAt,
                state : order.state.name,
                price: order.fullPrice
            }
        })

        return {
            name : user.name,
            bonuses: user.bonusQuantity,
            orders
        }
    }

    toDtoOrder(order : Order, dishes : OrderDish[]) {
        return {
            address: order.address,
            paymentType: order.paymentType,
            surrender: order.surrender,
            name : order.name,
            telephone : order.telephone,
            dishes: dishes.map(dish => {
                return {
                    amount: dish.amount,
                    image : dish.dish.image,
                    name : dish.dish.name,
                    saloon: dish.dish.saloon.name,
                    saloonId: dish.dish.saloon.id,
                    price : dish.dish.price
                }
            }),
            price : order.fullPrice,
            isPaid: order.isPaid,
            bonuses : order.bonuses,
            promocode: order.promocode ? {promo : order.promocodeId, value : order.promocode.value} : null
        }
    }

    toDtoOrders(orders : Order[], states: OrderState[]) {
        return {
            states : states.map(state => state.name),
            orders : orders.map(order => {
                return {
                    id : order.id,
                    date : order.createdAt,
                    state : order.state.name,
                    price : order.fullPrice,
                    isPaid : order.isPaid
                }
            })
        }
    }
}

export const usersMapper = new UsersMapper();