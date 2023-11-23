import { ObjectId } from 'mongodb';
import { dbConnector } from '../db-connector';

class RequestController {
  constructor() {}

  async get(id: string) {
    return dbConnector.ads.findOne({ _id: new ObjectId(id) });
  }

  async delete(id: string) {
    return dbConnector.ads.deleteOne({ _id: new ObjectId(id) });
  }

  async update({ id, name }: { id: string; name: string }) {
    return dbConnector.ads.updateOne({ _id: new ObjectId(id) }, { $set: { name } });
  }
}

export const requestController = new RequestController();
