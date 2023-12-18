export type Nullable<T> = T | null | undefined;

export enum PurchaseStatuses {
  Future = 'future',
  Canceled = 'canceled',
  DepositPaid = 'depositPaid',
  Paid = 'paid',
  UnderCourtConsidiration = 'underCourtConsideration',
  Saling = 'saling',
  Completed = 'completed'
}
