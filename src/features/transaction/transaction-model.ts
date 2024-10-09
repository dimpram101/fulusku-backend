export interface TransferRequest {
  from_account_id: string;
  to_account_id: string;
  amount: number;
  from_pin: string;
}