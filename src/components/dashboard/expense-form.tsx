
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomCategory, Expense, Account, DEFAULT_CATEGORIES, DEFAULT_ACCOUNTS } from '@/types/finance';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpenseFormProps {
  onBack: () => void;
  onSave: (expense: Expense) => void;
}

const ExpenseForm = ({ onBack, onSave }: ExpenseFormProps) => {
  // Load categories and accounts from localStorage
  const categories = React.useMemo(() => {
    const saved = localStorage.getItem('honey-categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  }, []);

  const accounts = React.useMemo(() => {
    const saved = localStorage.getItem('honey-accounts');
    return saved ? JSON.parse(saved) : DEFAULT_ACCOUNTS;
  }, []);

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || 'food');
  const [account, setAccount] = useState(accounts[0]?.id || 'main');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    const expense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      category,
      description,
      date,
      account,
    };

    onSave(expense);
    onBack();
  };

  return (
    <div className="p-4 pb-24 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-accent"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">Add Expense</h1>
      </div>

      <Card className="shadow-soft border-0">
        <CardHeader>
          <CardTitle className="text-lg">New Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (€)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                className="text-lg font-medium rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Account</Label>
              <select
                className="w-full h-10 px-3 border rounded-md"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
              >
                {accounts.map((acc: Account) => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat: CustomCategory) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200",
                      category === cat.id
                        ? "border-primary bg-accent text-primary scale-105"
                        : "border-border bg-white hover:border-primary/50"
                    )}
                  >
                    {cat.emoji} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did you spend on?"
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 hover:scale-105 transition-all duration-200 rounded-xl py-3 text-white font-medium shadow-soft"
            >
              Save Expense
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseForm;
