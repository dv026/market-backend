import { dbConnector } from '../db-connector';
import { PurchaseStatuses } from '../types';
import { calculatePercent } from './../utils/calculate-percent';

class StatsController {
  constructor() {}

  async getStats() {
    const allPurchases = await dbConnector.purchases.find().toArray();
    // go to another controller or service
    let purchaseCount = 0;
    let moneyInDeel = 0;
    let salesCount = 0;
    let profit = 0;
    let dimaProfit = 0;
    let allSpentMoney = 0;
    let allEarnedMoney = 0;
    console.log('allPurchases', allPurchases);
    allPurchases.forEach((p) => {
      // если депозит вернули, не добавляем его не включаем
      const deposit = p.deposit.returned ? 0 : calculatePercent(p.deposit.rate, p.price);
      const fakeFee = p.fakeFee.returned ? 0 : calculatePercent(p.fakeFee.rate, p.price);
      const commission = p.commission.returned ? 0 : calculatePercent(p.commission.rate, p.price);
      const extraInfoMoney = p.extraInfo?.reduce((amount, { value }) => (amount += value), 0) || 0;

      console.log('extrra', extraInfoMoney);

      const moneySpentForPurchase = p.price + commission + fakeFee + extraInfoMoney;
      console.log('moneySpentForPurchase', moneySpentForPurchase);

      if (p.status === PurchaseStatuses.Future) {
        //nothing
      } else if (
        p.status === PurchaseStatuses.DepositPaid ||
        p.status === PurchaseStatuses.Canceled
      ) {
        moneyInDeel += deposit + fakeFee + commission;
      } else if (
        p.status === PurchaseStatuses.Paid ||
        p.status === PurchaseStatuses.Saling ||
        p.status === PurchaseStatuses.UnderCourtConsidiration
      ) {
        purchaseCount++;
        // не добавляем депозит, тк он идетв счет стоимости
        moneyInDeel += p.price + fakeFee + commission;
      } else if (p.status === PurchaseStatuses.Completed) {
        purchaseCount++;

        allSpentMoney += moneySpentForPurchase;
        profit += p.soldPrice - moneySpentForPurchase;
        dimaProfit += profit / 2;
        salesCount++;
        allEarnedMoney += profit;
      }
    });
    const growPercent = Math.floor((allEarnedMoney / allSpentMoney) * 100) || 0;
    return { purchaseCount, moneyInDeel, profit, salesCount, dimaProfit, growPercent };
  }
}

export const statsController = new StatsController();
