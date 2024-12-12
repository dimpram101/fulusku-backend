export interface RegisterRequest {
  full_name: string;
  phone_number: string;
  pin: string;
}

export interface LoginRequest {
  phone_number: string;
}

export interface InsertPinRequest {
  phone_number: string;
  pin: string;
}
