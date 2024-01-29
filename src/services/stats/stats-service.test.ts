import { statsService } from './stats-service'
import { PurchaseModel } from '../../models/purchase-model'

// комиссия
// будушая
// 90_000
let car1: PurchaseModel = {
  id: 'commission-1',
  price: 90_000,
  status: 'future',
  type: 'commission',
  category: 'car',
}

// комиссия
// куплена
// 170_000 - (90_000 + 10_000) = 70_000
let car2: PurchaseModel = {
  commission: {
    rate: 30,
    returned: false,
    canReturn: false,
  },
  deposit: {
    rate: 30,
    returned: false,
    canReturn: false,
  },
  extraInfo: [
    {
      name: 'резина',
      value: 10_000,
    },
  ],
  fakeFee: {
    canReturn: false,
    rate: 30,
    returned: false,
  },
  id: 'commission-2',
  price: 90_000,
  soldPrice: 170_000,
  status: 'paid',
  type: 'commission',
  category: 'car',
}

// комиссия
// продана
// 170_000 - (90_000 + 10_000) = 70_000
let car3: PurchaseModel = {
  commission: {
    rate: 30,
    returned: false,
    canReturn: false,
  },
  deposit: {
    rate: 30,
    returned: false,
    canReturn: false,
  },
  extraInfo: [
    {
      name: 'резина',
      value: 10_000,
    },
  ],
  fakeFee: {
    canReturn: false,
    rate: 30,
    returned: false,
  },
  id: 'commission-3',
  price: 90_000,
  soldPrice: 170_000,
  status: 'completed',
  type: 'commission',
  category: 'car',
}

// комиссия
// продана
// 170_000 - 90_000 = 70_000
let car4: PurchaseModel = {
  id: 'commission-4',
  price: 90_000,
  soldPrice: 170_000,
  status: 'completed',
  type: 'commission',
  category: 'car',
}

// комиссия
// в суде
// 90_000 + 10_000
let car5: PurchaseModel = {
  id: 'commission-5',
  price: 90_000,
  extraInfo: [
    {
      name: 'общее',
      value: 10_000,
    },
  ],
  status: 'underCourtConsideration',
  type: 'commission',
  category: 'car',
}

// комиссия
// в продаже
// 90_000 + 10_000
let car6: PurchaseModel = {
  id: 'commission-5',
  price: 90_000,
  extraInfo: [
    {
      name: 'общее',
      value: 10_000,
    },
  ],
  status: 'saling',
  type: 'commission',
  category: 'car',
}

// комиссия
// в продаже
// 90_000 + 10_000
let car7: PurchaseModel = {
  id: 'commission-5',
  price: 90_000,
  extraInfo: [
    {
      name: 'общее',
      value: 10_000,
    },
  ],
  status: 'canceled',
  type: 'commission',
  category: 'car',
}

describe('commission', () => {
  test('paid with extra', () => {
    const {
      moneyInDeelNow,
      purchaseCount,
      profit,
      salesCount,
      userProfit,
      growPercent,
    } = statsService.getStats(car1)
    expect(moneyInDeelNow).toBe(0)
    expect(purchaseCount).toBe(0)
    expect(profit).toBe(0)
    expect(salesCount).toBe(0)
    expect(userProfit).toBe(0)
    expect(growPercent).toBe(0)
  })

  test('paid with extra', () => {
    const {
      moneyInDeelNow,
      purchaseCount,
      profit,
      salesCount,
      userProfit,
      growPercent,
    } = statsService.getStats(car2)
    expect(moneyInDeelNow).toBe(100_000)
    expect(purchaseCount).toBe(1)
    expect(profit).toBe(0)
    expect(salesCount).toBe(0)
    expect(userProfit).toBe(0)
    expect(growPercent).toBe(0)
  })

  test('sold with extra', () => {
    const {
      moneyInDeelNow,
      purchaseCount,
      profit,
      salesCount,
      userProfit,
      growPercent,
    } = statsService.getStats(car3)
    expect(moneyInDeelNow).toBe(0)
    expect(purchaseCount).toBe(1)
    expect(profit).toBe(70_000)
    expect(salesCount).toBe(1)
    expect(userProfit).toBe(35_000)
    expect(growPercent).toBe(70)
  })

  test('sold without extra', () => {
    const {
      moneyInDeelNow,
      purchaseCount,
      profit,
      salesCount,
      userProfit,
      growPercent,
    } = statsService.getStats(car4)
    expect(moneyInDeelNow).toBe(0)
    expect(purchaseCount).toBe(1)
    expect(profit).toBe(80_000)
    expect(salesCount).toBe(1)
    expect(userProfit).toBe(40_000)
    expect(growPercent).toBe(88)
  })

  test('in court with extra', () => {
    const {
      moneyInDeelNow,
      purchaseCount,
      profit,
      salesCount,
      userProfit,
      growPercent,
    } = statsService.getStats(car5)
    expect(moneyInDeelNow).toBe(100_000)
    expect(purchaseCount).toBe(1)
    expect(profit).toBe(0)
    expect(salesCount).toBe(0)
    expect(userProfit).toBe(0)
    expect(growPercent).toBe(0)
  })

  test('in sale with extra', () => {
    const {
      moneyInDeelNow,
      purchaseCount,
      profit,
      salesCount,
      userProfit,
      growPercent,
    } = statsService.getStats(car6)
    expect(moneyInDeelNow).toBe(100_000)
    expect(purchaseCount).toBe(1)
    expect(profit).toBe(0)
    expect(salesCount).toBe(0)
    expect(userProfit).toBe(0)
    expect(growPercent).toBe(0)
  })

  test('canceled with extra', () => {
    const {
      moneyInDeelNow,
      purchaseCount,
      profit,
      salesCount,
      userProfit,
      growPercent,
    } = statsService.getStats(car7)
    expect(moneyInDeelNow).toBe(0)
    expect(purchaseCount).toBe(0)
    expect(profit).toBe(0)
    expect(salesCount).toBe(0)
    expect(userProfit).toBe(0)
    expect(growPercent).toBe(0)
  })
})
