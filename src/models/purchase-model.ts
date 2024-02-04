import { Nullable } from '../types'

export interface CarModel extends PurchaseModel {
  brand: Nullable<string>
  model: Nullable<string>
  year: Nullable<number>
  mileage: Nullable<number>
}

export interface FeeModel {
  rate: Nullable<number>
  canReturn: Nullable<boolean>
  returned: Nullable<boolean>
}

export type PurchaseStatus =
  | 'future'
  | 'canceled'
  | 'depositPaid'
  | 'paid'
  | 'underCourtConsideration'
  | 'saling'
  | 'completed'

export type PurchaseType = 'commission' | 'auction'

export type PurchaseCategory = 'appartment' | 'car'

export interface PurchaseModel {
  id: string
  price: Nullable<number>
  category: PurchaseCategory
  type: PurchaseType
  status: PurchaseStatus
  soldPrice?: Nullable<number>
  commission?: FeeModel
  deposit?: FeeModel
  fakeFee?: FeeModel
  extraInfo?: ExtraInfo[]
}

export interface ExtraInfo {
  name: string
  value: number
}
