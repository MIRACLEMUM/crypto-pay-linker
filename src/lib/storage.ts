import { PaymentLink, CreatePaymentLinkInput } from '@/types/payment';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'paylink_links';

export function getPaymentLinks(): PaymentLink[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getPaymentLinkById(id: string): PaymentLink | null {
  const links = getPaymentLinks();
  return links.find(link => link.id === id) || null;
}

export function createPaymentLink(input: CreatePaymentLinkInput, createdBy?: string): PaymentLink {
  const links = getPaymentLinks();
  
  const newLink: PaymentLink = {
    id: uuidv4(),
    recipient: input.recipient,
    amount: input.amount,
    currency: input.currency,
    message: input.message,
    createdAt: new Date().toISOString(),
    createdBy,
    paid: false,
  };
  
  links.push(newLink);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  
  return newLink;
}

export function markPaymentAsPaid(id: string, paidBy: string, txHash: string): PaymentLink | null {
  const links = getPaymentLinks();
  const index = links.findIndex(link => link.id === id);
  
  if (index === -1) return null;
  
  links[index] = {
    ...links[index],
    paid: true,
    paidAt: new Date().toISOString(),
    paidBy,
    txHash,
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  return links[index];
}

export function getPaymentLinksByCreator(address: string): PaymentLink[] {
  const links = getPaymentLinks();
  return links.filter(link => link.createdBy?.toLowerCase() === address.toLowerCase());
}

export function generatePaymentUrl(id: string): string {
  return `${window.location.origin}/pay/${id}`;
}
