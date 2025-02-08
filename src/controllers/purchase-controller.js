"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseController = void 0;
var mongodb_1 = require("mongodb");
var db_connector_1 = require("../db-connector");
var types_1 = require("../types");
var stats_service_1 = require("../services/stats/stats-service");
var PurchaseController = /** @class */ (function () {
    function PurchaseController() {
        this.hasFakeFee = function (rate) { return rate !== 0; };
    }
    PurchaseController.prototype.get = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, db_connector_1.dbConnector.purchases.findOne({ _id: new mongodb_1.ObjectId(id) })];
            });
        });
    };
    PurchaseController.prototype.getList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var purchases, enrichedPurchases;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_connector_1.dbConnector.purchases.find().limit(10).toArray()];
                    case 1:
                        purchases = _a.sent();
                        enrichedPurchases = purchases.map(function (p) {
                            var profit = stats_service_1.statsService.getStats(p).profit;
                            return __assign(__assign({}, p), { profit: profit });
                        });
                        return [2 /*return*/, enrichedPurchases];
                }
            });
        });
    };
    PurchaseController.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, db_connector_1.dbConnector.purchases.deleteOne({ _id: new mongodb_1.ObjectId(id) })];
            });
        });
    };
    PurchaseController.prototype.update = function (_a) {
        var id = _a.id, year = _a.year, price = _a.price, brand = _a.brand, mileage = _a.mileage, model = _a.model, commission = _a.commission, deposit = _a.deposit, type = _a.type, transmission = _a.transmission, vin = _a.vin;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, db_connector_1.dbConnector.purchases.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                        $set: {
                            year: year,
                            price: price,
                            brand: brand,
                            mileage: mileage,
                            model: model,
                            deposit: deposit,
                            commission: commission,
                            type: type,
                            vin: vin,
                            transmission: transmission,
                        },
                    })];
            });
        });
    };
    PurchaseController.prototype.updateStatus = function (_a) {
        var id = _a.id, status = _a.status;
        return __awaiter(this, void 0, void 0, function () {
            var purchase, enrichedPurchase;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.get(id)];
                    case 1:
                        purchase = _b.sent();
                        enrichedPurchase = {
                            status: status,
                        };
                        if (status !== types_1.PurchaseStatuses.Future) {
                            if (!purchase.fakeFee.returned) {
                                enrichedPurchase.fakeFee = __assign(__assign({}, purchase.fakeFee), { canReturn: this.hasFakeFee(purchase.fakeFee.rate) });
                            }
                        }
                        if (status === types_1.PurchaseStatuses.Canceled) {
                            enrichedPurchase.commission = __assign(__assign({}, purchase.deposit), { canReturn: true });
                            if (!purchase.deposit.returned) {
                                enrichedPurchase.deposit = __assign(__assign({}, purchase.deposit), { canReturn: true });
                            }
                            if (!purchase.fakeFee.returned) {
                                enrichedPurchase.fakeFee = __assign(__assign({}, purchase.fakeFee), { canReturn: this.hasFakeFee(purchase.fakeFee.rate) });
                            }
                        }
                        return [2 /*return*/, db_connector_1.dbConnector.purchases.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: __assign({}, enrichedPurchase) })];
                }
            });
        });
    };
    PurchaseController.prototype.returnFakeDeposit = function (_a) {
        var id = _a.id;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, db_connector_1.dbConnector.purchases.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                        $set: {
                            fakeFee: {
                                returned: true,
                            },
                        },
                    })];
            });
        });
    };
    PurchaseController.prototype.returnDeposit = function (_a) {
        var id = _a.id;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, db_connector_1.dbConnector.purchases.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                        $set: {
                            deposit: {
                                returned: true,
                            },
                        },
                    })];
            });
        });
    };
    PurchaseController.prototype.partialUpdate = function (_a) {
        var id = _a.id, data = __rest(_a, ["id"]);
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, db_connector_1.dbConnector.purchases.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: __assign({}, data) })];
            });
        });
    };
    // async updateSoldPrice({ id, soldPrice }: Partial<CarModel>) {
    //   return dbConnector.purchases.updateOne({ _id: new ObjectId(id) }, { $set: { soldPrice } });
    // }
    PurchaseController.prototype.create = function (purchase) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (purchase.category === 'car') {
                    purchase.deposit = __assign(__assign({}, purchase.deposit), { canReturn: false, returned: false });
                    purchase.fakeFee = __assign(__assign({}, purchase.fakeFee), { canReturn: false, returned: false });
                    purchase.commission = __assign(__assign({}, purchase.commission), { canReturn: false, returned: false });
                    return [2 /*return*/, db_connector_1.dbConnector.purchases.insertOne(purchase)];
                }
                return [2 /*return*/];
            });
        });
    };
    return PurchaseController;
}());
exports.purchaseController = new PurchaseController();
