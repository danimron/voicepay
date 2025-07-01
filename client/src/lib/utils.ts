import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAmount(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseInt(amount.replace(/\D/g, '')) : amount;
  return numAmount.toLocaleString('id-ID');
}

export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseInt(amount.replace(/\D/g, '')) : amount;
  return `Rp ${numAmount.toLocaleString('id-ID')}`;
}
