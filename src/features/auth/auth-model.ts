export interface RegisterRequest {
  full_name: string;
  phone_number: string;
  pin: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
