import { ObjectId } from 'mongodb';
import { dbConnector } from '../db-connector';
import { CarModel, PurchaseModel } from '../models/purchase-model';

class PurchaseController {
  constructor() {}

  async get(id: string) {
    return dbConnector.purchases.findOne({ _id: new ObjectId(id) });
  }

  async delete(id: string) {
    return dbConnector.purchases.deleteOne({ _id: new ObjectId(id) });
  }

  async update({ id, year, price, brand, mileage, model }: CarModel) {
    return dbConnector.purchases.updateOne(
      { _id: new ObjectId(id) },
      { $set: { year, price, brand, mileage, model } }
    );
  }

  async create(purchaseModel: CarModel) {
    if (purchaseModel.type === 'car') {
      return dbConnector.purchases.insertOne(purchaseModel);
    }
  }
}

export const requestController = new PurchaseController();
