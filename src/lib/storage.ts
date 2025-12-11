import { supabase } from './supabase';
import { PaymentLink, CreatePaymentLinkInput } from '@/types/payment';

// Fetch all payment links
export async function getPaymentLinks(): Promise<PaymentLink[]> {
  const { data, error } = await supabase
    .from('payment_links')
    .select('*');

  if (error) {
    console.error('Error loading payment links:', error);
    return [];
  }

  return data as PaymentLink[];
}

// Fetch one payment link by id
export async function getPaymentLinkById(id: string): Promise<PaymentLink | null> {
  const { data, error } = await supabase
    .from('payment_links')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;

  return data as PaymentLink;
}

// Create a new payment link
export async function createPaymentLink(input: CreatePaymentLinkInput, createdBy?: string) {
  const { data, error } = await supabase
    .from('payment_links')
    .insert({
      recipient: input.recipient,
      amount: input.amount,
      currency: input.currency,
      message: input.message,
      created_by: createdBy,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating link:', error);
    return null;
  }

  return data as PaymentLink;
}

// Mark a payment as paid
export async function markPaymentAsPaid(id: string, paidBy: string, txHash: string) {
  const { data, error } = await supabase
    .from('payment_links')
    .update({
      paid: true,
      paid_at: new Date().toISOString(),
      paid_by: paidBy,
      tx_hash: txHash,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating payment:', error);
    return null;
  }

  return data as PaymentLink;
}

// Fetch links by the creator
export async function getPaymentLinksByCreator(address: string) {
  const { data, error } = await supabase
    .from('payment_links')
    .select('*')
    .eq('created_by', address.toLowerCase());

  if (error) return [];

  return data as PaymentLink[];
}

// Generate the URL of the payment link
export function generatePaymentUrl(id: string): string {
  return `${window.location.origin}/pay/${id}`;
}
