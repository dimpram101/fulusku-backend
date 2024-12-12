import { PaymentMemberRole, PaymentStatus } from "@prisma/client";

export type PaymentSoloRequest = {
  payment_id: string;
  account_id: string;
};

export type CreateDummyPaymentRequest = {
  account_number: string | null;
  amount: number | null;
};

type PaymentMember = {
  account_id: string;
  amount: number;
  role: keyof typeof PaymentMemberRole;
};

export type PaymentWithMemberRequest = {
  payment_id: string;
  evenly?: boolean | null;
  members: PaymentMember[];
};

export type UpdateMemberStatusRequest = {
  payment_id: string;
  account_id: string;
  status: keyof typeof PaymentStatus;
};
