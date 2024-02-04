import { MongoClient, Collection } from 'mongodb'
import { PurchaseModel } from './models/purchase-model'

class DbConnector {
  mongoclient: MongoClient
  purchases: Collection<PurchaseModel>

  async connect(url: string) {
    this.mongoclient = new MongoClient(url)
    await this.mongoclient.connect()

    this.purchases = this.mongoclient.db('market').collection('purchases')
  }
}

export const dbConnector = new DbConnector()
