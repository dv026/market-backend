import { PurchaseModel } from '../models/purchase-model'
import { PurchaseStatuses } from '../types'
import { calculatePercent } from '../utils/calculate-percent'

class StatsService {
  getStats(p: PurchaseModel): {
    moneyInDeel: number
    purchaseCount: number
    allSpentMoney: number
    profit: number
    salesCount: number
    allEarnedMoney: number
    userProfit: number
    growPercent: number
  } {
    //return values
    let moneyInDeel = 0
    let purchaseCount = 0
    let allSpentMoney = 0
    let profit = 0
    let salesCount = 0
    let allEarnedMoney = 0

    // vars for calculations
    let deposit = 0
    let fakeFee = 0
    let commission = 0
    if (p.purchaseType === 'auction') {
      // если депозит вернули, не добавляем его не включаем
      deposit = p.deposit.returned
        ? 0
        : calculatePercent(p.deposit.rate, p.price)
      fakeFee = p.fakeFee.returned
        ? 0
        : calculatePercent(p.fakeFee.rate, p.price)
      commission = p.commission.returned
        ? 0
        : calculatePercent(p.commission.rate, p.price)
    }
    const extraInfoMoney =
      p.extraInfo?.reduce((amount, { value }) => (amount += value), 0) || 0

    const moneySpentForPurchase =
      p.price + commission + fakeFee + extraInfoMoney

    if (p.status === PurchaseStatuses.Future) {
      //nothing
    } else if (
      p.status === PurchaseStatuses.DepositPaid ||
      p.status === PurchaseStatuses.Canceled
    ) {
      moneyInDeel += deposit + fakeFee + commission + extraInfoMoney
    } else if (
      p.status === PurchaseStatuses.Paid ||
      p.status === PurchaseStatuses.Saling ||
      p.status === PurchaseStatuses.UnderCourtConsidiration
    ) {
      purchaseCount++
      // не добавляем депозит, тк он идетв счет стоимости
      moneyInDeel += p.price + fakeFee + commission + extraInfoMoney
    } else if (p.status === PurchaseStatuses.Completed) {
      purchaseCount++

      allSpentMoney += moneySpentForPurchase
      profit += Math.floor(p.soldPrice - moneySpentForPurchase)
      salesCount++
      allEarnedMoney += profit
    }

    const growPercent = Math.floor((allEarnedMoney / allSpentMoney) * 100) || 0
    return {
      moneyInDeel: Math.floor(moneyInDeel),
      purchaseCount,
      allSpentMoney,
      profit,
      salesCount,
      allEarnedMoney,
      userProfit: profit / 2,
      growPercent,
    }
  }
}

export const statsService = new StatsService()
