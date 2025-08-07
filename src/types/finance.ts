
export interface Expense {
  id: string;
  amount: number;
  category: string; // Changed to string to support custom categories
  description: string;
  date: string;
  account: string; // Made required for account tracking
  recurring?: boolean;
}

export interface Income {
  id: string;
  amount: number;
  description: string;
  date: string;
  account: string; // Made required for account tracking
  recurring?: boolean;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}

export interface CategoryGoal {
  id: string;
  category: string;
  monthlyTarget: number;
  description?: string;
  color: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'checking' | 'savings' | 'credit' | 'cash';
  color: string;
}

export interface Transfer {
  id: string;
  amount: number;
  fromAccount: string;
  toAccount: string;
  description: string;
  date: string;
}

export interface CustomCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export type ExpenseCategory = 
  | 'food' 
  | 'transport' 
  | 'entertainment' 
  | 'shopping' 
  | 'health' 
  | 'bills' 
  | 'savings' 
  | 'other';

export const DEFAULT_CATEGORIES: CustomCategory[] = [
  { id: 'food', name: 'Food', emoji: '🍕', color: 'hsl(var(--category-food))' },
  { id: 'transport', name: 'Transport', emoji: '🚗', color: 'hsl(var(--category-transport))' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎬', color: 'hsl(var(--category-entertainment))' },
  { id: 'shopping', name: 'Shopping', emoji: '🛍️', color: 'hsl(var(--category-shopping))' },
  { id: 'health', name: 'Health', emoji: '⚕️', color: 'hsl(var(--category-health))' },
  { id: 'bills', name: 'Bills', emoji: '📄', color: 'hsl(var(--category-bills))' },
  { id: 'savings', name: 'Savings', emoji: '💰', color: 'hsl(var(--category-savings))' },
  { id: 'other', name: 'Other', emoji: '📦', color: 'hsl(var(--category-other))' },
];

export const DEFAULT_ACCOUNTS: Account[] = [
  { id: 'main', name: 'Main Account', balance: 0, type: 'checking', color: 'hsl(var(--honey-primary))' },
];

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: '🍕 Food',
  transport: '🚗 Transport',
  entertainment: '🎬 Entertainment',
  shopping: '🛍️ Shopping',
  health: '⚕️ Health',
  bills: '📄 Bills',
  savings: '💰 Savings',
  other: '📦 Other'
};

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: 'bg-category-food',
  transport: 'bg-category-transport',
  entertainment: 'bg-category-entertainment',
  shopping: 'bg-category-shopping',
  health: 'bg-category-health',
  bills: 'bg-category-bills',
  savings: 'bg-category-savings',
  other: 'bg-category-other'
};
