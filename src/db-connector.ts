import { MongoClient, Collection } from 'mongodb';
import { RequestModel } from './models/request-model';

class DbConnector {
  mongoclient: MongoClient;
  ads: Collection<RequestModel>;

  async connect(url: string) {
    this.mongoclient = new MongoClient(url);
    await this.mongoclient.connect();

    this.ads = this.mongoclient.db('request').collection('requests');
  }
}

export const dbConnector = new DbConnector();
