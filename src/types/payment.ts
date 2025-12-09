export interface PaymentLink {
  id: string;
  recipient: string;
  amount: string;
  currency: 'ETH' | 'USD';
  message?: string;
  createdAt: string;
  createdBy?: string;
  paid: boolean;
  paidAt?: string;
  paidBy?: string;
  txHash?: string;
}

export interface CreatePaymentLinkInput {
  recipient: string;
  amount: string;
  currency: 'ETH' | 'USD';
  message?: string;
}
