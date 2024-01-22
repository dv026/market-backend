import { MongoClient, Collection } from 'mongodb'
import { RequestModel } from './models/request-model'
import { PurchaseModel } from './models/purchase-model'

class DbConnector {
  mongoclient: MongoClient
  ads: Collection<RequestModel>
  purchases: Collection<PurchaseModel>

  async connect(url: string) {
    this.mongoclient = new MongoClient(url)
    await this.mongoclient.connect()

    this.ads = this.mongoclient.db('request').collection('requests')
    this.purchases = this.mongoclient.db('market').collection('purchases')
  }
}

export const dbConnector = new DbConnector()
