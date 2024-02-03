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
  extraInfo: [
    {
      name: 'резина',
      value: 10_000,
    },
  ],
  id: 'commission-3',
  price: 90_000,
  soldPrice: 170_000,
  status: 'completed',
  type: 'commission',
  category: 'car',
}

// комиссия
// продана
// 170_000 - 90_000 = 80_000
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
  id: 'commission-6',
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
// отменена
// 90_000 + 10_000
let car7: PurchaseModel = {
  id: 'commission-7',
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

  test('all commission items', () => {
    const items = [car1, car2, car3, car4, car5, car6, car7]

    let purchaseCount = 0
    let moneyInDeelNow = 0
    let salesCount = 0
    let profit = 0
    let allSpentMoney = 0
    let userProfit = 0

    items.forEach((p) => {
      const {
        purchaseCount: purchaseCountElement,
        moneyInDeelNow: moneyInDeelNowElement,
        salesCount: salesCountElement,
        profit: profitElement,
        userProfit: userProfitElement,
        allSpentMoney: allSpentMoneyElement,
      } = statsService.getStats(p)
      purchaseCount += purchaseCountElement
      moneyInDeelNow += moneyInDeelNowElement
      salesCount += salesCountElement
      profit += profitElement
      userProfit += userProfitElement
      allSpentMoney += allSpentMoneyElement
    })

    const growPercent = Math.floor((profit / allSpentMoney) * 100) || 0

    expect(purchaseCount).toBe(5)
    expect(moneyInDeelNow).toBe(300_000)
    expect(profit).toBe(150_000)
    expect(salesCount).toBe(2)
    expect(userProfit).toBe(75_000)
    expect(growPercent).toBe(78)
  })
})

// aукцион
// будушая
// 90_000
let car1_a: PurchaseModel = {
  id: 'auction-1',
  price: 90_000,
  status: 'future',
  type: 'auction',
  category: 'car',
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
  fakeFee: {
    rate: 30,
    canReturn: false,
    returned: false,
  },
}

// aукцион
// куплена без fake
// 90_000
let car2_a: PurchaseModel = {
  id: 'auction-2',
  price: 90_000,
  status: 'paid',
  type: 'auction',
  category: 'car',
  commission: {
    rate: 15,
    returned: false,
    canReturn: false,
  },
  deposit: {
    rate: 15,
    returned: false,
    canReturn: false,
  },
  fakeFee: {
    rate: 0,
    canReturn: false,
    returned: false,
  },
}

// aукцион
// куплена
// без fake
// extra
// 90_000
let car3_a: PurchaseModel = {
  id: 'auction-3',
  price: 90_000,
  status: 'paid',
  type: 'auction',
  category: 'car',
  extraInfo: [
    {
      name: 'общее',
      value: 10_000,
    },
  ],
  commission: {
    rate: 15,
    returned: true,
    canReturn: false,
  },
  deposit: {
    rate: 15,
    returned: false,
    canReturn: false,
  },
  fakeFee: {
    rate: 0,
    canReturn: false,
    returned: false,
  },
}

// aукцион
// продана
// без fake
// 90_000
let car4_a: PurchaseModel = {
  id: 'auction-4',
  price: 90_000,
  soldPrice: 200_000,
  status: 'completed',
  type: 'auction',
  category: 'car',
  extraInfo: [
    {
      name: 'общее',
      value: 10_000,
    },
  ],
  commission: {
    rate: 15,
    returned: false,
    canReturn: false,
  },
  deposit: {
    rate: 15,
    returned: false,
    canReturn: false,
  },
  fakeFee: {
    rate: 0,
    canReturn: false,
    returned: false,
  },
}

// aукцион
// куплена
// fake
// extra
// 90_000
let car5_a: PurchaseModel = {
  id: 'auction-5',
  price: 90_000,
  soldPrice: 200_000,
  status: 'paid',
  type: 'auction',
  category: 'car',
  extraInfo: [
    {
      name: 'общее',
      value: 10_000,
    },
  ],
  commission: {
    rate: 15,
    returned: false,
    canReturn: false,
  },
  deposit: {
    rate: 15,
    returned: false,
    canReturn: false,
  },
  fakeFee: {
    rate: 30,
    canReturn: false,
    returned: false,
  },
}

// aукцион
// куплена
// fake returned
// extra
// 90_000
let car6_a: PurchaseModel = {
  id: 'auction-6',
  price: 90_000,
  soldPrice: 200_000,
  status: 'paid',
  type: 'auction',
  category: 'car',
  extraInfo: [
    {
      name: 'общее',
      value: 10_000,
    },
  ],
  commission: {
    rate: 15,
    returned: false,
    canReturn: false,
  },
  deposit: {
    rate: 15,
    returned: false,
    canReturn: false,
  },
  fakeFee: {
    rate: 30,
    canReturn: false,
    returned: true,
  },
}

// aукцион
// deposited
// fake
// 90_000
let car7_a: PurchaseModel = {
  id: 'auction-7',
  price: 90_000,
  soldPrice: 200_000,
  status: 'depositPaid',
  type: 'auction',
  category: 'car',
  commission: {
    rate: 15,
    returned: false,
    canReturn: false,
  },
  deposit: {
    rate: 15,
    returned: false,
    canReturn: false,
  },
  fakeFee: {
    rate: 30,
    canReturn: false,
    returned: false,
  },
}

// aукцион
// deposited
// fake returned
// 90_000
let car8_a: PurchaseModel = {
  id: 'auction-8',
  price: 90_000,
  soldPrice: 200_000,
  status: 'depositPaid',
  type: 'auction',
  category: 'car',
  commission: {
    rate: 15,
    returned: false,
    canReturn: false,
  },
  deposit: {
    rate: 15,
    returned: false,
    canReturn: false,
  },
  fakeFee: {
    rate: 30,
    canReturn: false,
    returned: true,
  },
}

// aукцион
// saling
// fake returned
// 90_000
let car9_a: PurchaseModel = {
  id: 'auction-9',
  price: 90_000,
  soldPrice: 200_000,
  status: 'saling',
  type: 'auction',
  category: 'car',
  commission: {
    rate: 15,
    returned: false,
    canReturn: false,
  },
  deposit: {
    rate: 15,
    returned: false,
    canReturn: false,
  },
  fakeFee: {
    rate: 30,
    canReturn: false,
    returned: true,
  },
}

// aукцион
// saling
// fake returned
// 90_000
let car10_a: PurchaseModel = {
  id: 'auction-10',
  price: 90_000,
  soldPrice: 200_000,
  status: 'underCourtConsideration',
  type: 'auction',
  category: 'car',
  commission: {
    rate: 15,
    returned: false,
    canReturn: false,
  },
  deposit: {
    rate: 15,
    returned: false,
    canReturn: false,
  },
  fakeFee: {
    rate: 30,
    canReturn: false,
    returned: true,
  },
}

// aукцион
// cancled
// fake returned
// 90_000
let car11_a: PurchaseModel = {
  id: 'auction-11',
  price: 90_000,
  soldPrice: 200_000,
  status: 'canceled',
  type: 'auction',
  category: 'car',
  commission: {
    rate: 15,
    returned: false,
    canReturn: false,
  },
  deposit: {
    rate: 15,
    returned: false,
    canReturn: false,
  },
  fakeFee: {
    rate: 30,
    canReturn: false,
    returned: true,
  },
}

// aукцион
// cancled
// fake returned
// deposit returned
// 90_000
let car12_a: PurchaseModel = {
  id: 'auction-12',
  price: 90_000,
  soldPrice: 200_000,
  status: 'canceled',
  type: 'auction',
  category: 'car',
  commission: {
    rate: 15,
    returned: false,
    canReturn: false,
  },
  deposit: {
    rate: 15,
    returned: false,
    canReturn: true,
  },
  fakeFee: {
    rate: 30,
    canReturn: false,
    returned: true,
  },
}

// aукцион
// cancled
// fake returned
// deposit returned
// commission returned
// 90_000
let car13_a: PurchaseModel = {
  id: 'auction-13',
  price: 90_000,
  soldPrice: 200_000,
  status: 'canceled',
  type: 'auction',
  category: 'car',
  commission: {
    rate: 15,
    canReturn: false,
    returned: true,
  },
  deposit: {
    rate: 15,
    canReturn: false,
    returned: true,
  },
  fakeFee: {
    rate: 30,
    canReturn: false,
    returned: true,
  },
}

describe('auction', () => {
  test('future', () => {
    const {
      moneyInDeelNow,
      purchaseCount,
      profit,
      salesCount,
      userProfit,
      growPercent,
    } = statsService.getStats(car1_a)
    expect(moneyInDeelNow).toBe(0)
    expect(purchaseCount).toBe(0)
    expect(profit).toBe(0)
    expect(salesCount).toBe(0)
    expect(userProfit).toBe(0)
    expect(growPercent).toBe(0)
  })

  test('paid', () => {
    const {
      moneyInDeelNow,
      purchaseCount,
      profit,
      salesCount,
      userProfit,
      growPercent,
    } = statsService.getStats(car2_a)
    expect(moneyInDeelNow).toBe(103_500)
    expect(purchaseCount).toBe(1)
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
    } = statsService.getStats(car3_a)
    expect(moneyInDeelNow).toBe(100_000)
    expect(purchaseCount).toBe(1)
    expect(profit).toBe(0)
    expect(salesCount).toBe(0)
    expect(userProfit).toBe(0)
    expect(growPercent).toBe(0)
  })

  test('completed with extra', () => {
    const {
      moneyInDeelNow,
      purchaseCount,
      profit,
      salesCount,
      userProfit,
      growPercent,
    } = statsService.getStats(car4_a)
    expect(moneyInDeelNow).toBe(0)
    expect(purchaseCount).toBe(1)
    expect(profit).toBe(86_500)
    expect(salesCount).toBe(1)
    expect(userProfit).toBe(43_250)
    expect(growPercent).toBe(76)
  })

  test('paid with fake with extra', () => {
    const {
      moneyInDeelNow,
      purchaseCount,
      profit,
      salesCount,
      userProfit,
      growPercent,
    } = statsService.getStats(car5_a)
    expect(moneyInDeelNow).toBe(140_500)
    expect(purchaseCount).toBe(1)
    expect(profit).toBe(0)
    expect(salesCount).toBe(0)
    expect(userProfit).toBe(0)
    expect(growPercent).toBe(0)
  })

  test('paid with fake returned with extra', () => {
    const {
      moneyInDeelNow,
      purchaseCount,
      profit,
      salesCount,
      userProfit,
      growPercent,
    } = statsService.getStats(car6_a)
    expect(moneyInDeelNow).toBe(113_500)
    expect(purchaseCount).toBe(1)
    expect(profit).toBe(0)
    expect(salesCount).toBe(0)
    expect(userProfit).toBe(0)
    expect(growPercent).toBe(0)
  })

  test('deposit paid with fake', () => {
    const {
      moneyInDeelNow,
      purchaseCount,
      profit,
      salesCount,
      userProfit,
      growPercent,
    } = statsService.getStats(car7_a)
    expect(moneyInDeelNow).toBe(54_000)
    expect(purchaseCount).toBe(0)
    expect(profit).toBe(0)
    expect(salesCount).toBe(0)
    expect(userProfit).toBe(0)
    expect(growPercent).toBe(0)
  })

  test('deposit paid with fake returned', () => {
    const {
      moneyInDeelNow,
      purchaseCount,
      profit,
      salesCount,
      userProfit,
      growPercent,
    } = statsService.getStats(car8_a)
    expect(moneyInDeelNow).toBe(27_000)
    expect(purchaseCount).toBe(0)
    expect(profit).toBe(0)
    expect(salesCount).toBe(0)
    expect(userProfit).toBe(0)
    expect(growPercent).toBe(0)
  })

  test('saling with fake returned', () => {
    const {
      moneyInDeelNow,
      purchaseCount,
      profit,
      salesCount,
      userProfit,
      growPercent,
    } = statsService.getStats(car9_a)
    expect(moneyInDeelNow).toBe(103_500)
    expect(purchaseCount).toBe(1)
    expect(profit).toBe(0)
    expect(salesCount).toBe(0)
    expect(userProfit).toBe(0)
    expect(growPercent).toBe(0)
  })

  test('in court with fake returned', () => {
    const {
      moneyInDeelNow,
      purchaseCount,
      profit,
      salesCount,
      userProfit,
      growPercent,
    } = statsService.getStats(car10_a)
    expect(moneyInDeelNow).toBe(103_500)
    expect(purchaseCount).toBe(1)
    expect(profit).toBe(0)
    expect(salesCount).toBe(0)
    expect(userProfit).toBe(0)
    expect(growPercent).toBe(0)
  })

  test('cancled with fake returned', () => {
    const {
      moneyInDeelNow,
      purchaseCount,
      profit,
      salesCount,
      userProfit,
      growPercent,
    } = statsService.getStats(car11_a)
    expect(moneyInDeelNow).toBe(27_000)
    expect(purchaseCount).toBe(0)
    expect(profit).toBe(0)
    expect(salesCount).toBe(0)
    expect(userProfit).toBe(0)
    expect(growPercent).toBe(0)
  })

  test('cancled with fake returned and deposited returned', () => {
    const {
      moneyInDeelNow,
      purchaseCount,
      profit,
      salesCount,
      userProfit,
      growPercent,
    } = statsService.getStats(car12_a)
    expect(moneyInDeelNow).toBe(27_000)
    expect(purchaseCount).toBe(0)
    expect(profit).toBe(0)
    expect(salesCount).toBe(0)
    expect(userProfit).toBe(0)
    expect(growPercent).toBe(0)
  })

  test('cancled with fake returned and deposited returned and commission returned', () => {
    const {
      moneyInDeelNow,
      purchaseCount,
      profit,
      salesCount,
      userProfit,
      growPercent,
    } = statsService.getStats(car13_a)
    expect(moneyInDeelNow).toBe(0)
    expect(purchaseCount).toBe(0)
    expect(profit).toBe(0)
    expect(salesCount).toBe(0)
    expect(userProfit).toBe(0)
    expect(growPercent).toBe(0)
  })
})
