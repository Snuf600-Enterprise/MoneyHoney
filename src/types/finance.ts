
export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  account?: string;
  recurring?: boolean;
}

export interface Income {
  id: string;
  amount: number;
  description: string;
  date: string;
  account?: string;
  recurring?: boolean;
}

export interface Budget {
  category: ExpenseCategory;
  limit: number;
  spent: number;
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
