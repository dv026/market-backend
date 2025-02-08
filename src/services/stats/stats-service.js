"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsService = void 0;
var types_1 = require("../../types");
var calculate_percent_1 = require("../../utils/calculate-percent");
var StatsService = /** @class */ (function () {
    function StatsService() {
    }
    StatsService.prototype.getStats = function (p) {
        var _a;
        //return values
        var moneyInDeelNow = 0;
        var purchaseCount = 0;
        var allSpentMoney = 0;
        var profit = 0;
        var salesCount = 0;
        var growPercent = 0;
        // vars for calculations
        var deposit = 0;
        var fakeFee = 0;
        var commission = 0;
        if (p.type === 'auction') {
            // если депозит вернули, не добавляем его не включаем
            deposit = p.deposit.returned
                ? 0
                : (0, calculate_percent_1.calculatePercent)(p.deposit.rate, p.price);
            fakeFee = p.fakeFee.returned
                ? 0
                : (0, calculate_percent_1.calculatePercent)(p.fakeFee.rate, p.price);
            commission = p.commission.returned
                ? 0
                : (0, calculate_percent_1.calculatePercent)(p.commission.rate, p.price);
        }
        var extraInfoMoney = ((_a = p.extraInfo) === null || _a === void 0 ? void 0 : _a.reduce(function (amount, _a) {
            var value = _a.value;
            return (amount += value);
        }, 0)) || 0;
        var moneySpentForPurchase = p.price + commission + fakeFee + extraInfoMoney;
        if (p.status === types_1.PurchaseStatuses.Future) {
            //nothing
        }
        else if (p.status === types_1.PurchaseStatuses.DepositPaid ||
            p.status === types_1.PurchaseStatuses.Canceled) {
            // TODO: check if it's ok for 'auction' type
            moneyInDeelNow += deposit + fakeFee + commission;
        }
        else if (p.status === types_1.PurchaseStatuses.Paid ||
            p.status === types_1.PurchaseStatuses.Saling ||
            p.status === types_1.PurchaseStatuses.UnderCourtConsidiration) {
            purchaseCount++;
            // не добавляем депозит, тк он идет в счет стоимости
            moneyInDeelNow += moneySpentForPurchase;
        }
        else if (p.status === types_1.PurchaseStatuses.Completed) {
            purchaseCount++;
            // используем allSpentMoney, только чтобы в случае успешной продажи
            // тк с его помощью считаем процент заработка от растрат
            allSpentMoney += moneySpentForPurchase;
            profit += Math.floor(p.soldPrice - moneySpentForPurchase);
            salesCount++;
            growPercent = Math.floor((profit / allSpentMoney) * 100) || 0;
        }
        return {
            moneyInDeelNow: Math.floor(moneyInDeelNow),
            purchaseCount: purchaseCount,
            profit: profit,
            salesCount: salesCount,
            userProfit: profit / 2,
            growPercent: growPercent,
            allSpentMoney: allSpentMoney,
        };
    };
    return StatsService;
}());
exports.statsService = new StatsService();
