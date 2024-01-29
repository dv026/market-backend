import { dbConnector } from '../db-connector'
import { statsService } from '../services/stats/stats-service'
import { PurchaseStatuses } from '../types'
import { calculatePercent } from './../utils/calculate-percent'

class StatsController {
  constructor() {}

  async getStats() {
    const allPurchases = await dbConnector.purchases.find().toArray()
    // go to another controller or service
    let purchaseCount = 0
    let moneyInDeelNow = 0
    let salesCount = 0
    let profit = 0
    let allSpentMoney = 0
    let userProfit = 0

    allPurchases.forEach((p) => {
      const {
        purchaseCount: purchaseCountElement,
        moneyInDeelNow: moneyInDeelNowElement,
        salesCount: salesCountElement,
        profit: profitElement,
        userProfit: userProfitElement,
      } = statsService.getStats(p)
      purchaseCount += purchaseCountElement
      moneyInDeelNow += moneyInDeelNowElement
      salesCount += salesCountElement
      profit += profitElement
      userProfit += userProfitElement
    })

    const growPercent = Math.floor((profit / allSpentMoney) * 100) || 0

    return {
      purchaseCount,
      moneyInDeelNow,
      profit,
      salesCount,
      userProfit,
      growPercent,
    }
  }
}

export const statsController = new StatsController()
