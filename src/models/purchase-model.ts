import { Nullable } from '../types';

export interface CarModel extends PurchaseModel {
  brand: Nullable<string>;
  model: Nullable<string>;
  year: Nullable<number>;
  mileage: Nullable<number>;
}

export interface PurchaseModel {
  id: string;
  price: Nullable<number>;
  type: string;
}
