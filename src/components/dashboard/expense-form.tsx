
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORY_LABELS, ExpenseCategory, Expense } from '@/types/finance';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpenseFormProps {
  onBack: () => void;
  onSave: (expense: Expense) => void;
}

const ExpenseForm = ({ onBack, onSave }: ExpenseFormProps) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
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
    };

    onSave(expense);
    onBack();
  };

  const categoryButtons = Object.entries(CATEGORY_LABELS).map(([key, label]) => (
    <button
      key={key}
      type="button"
      onClick={() => setCategory(key as ExpenseCategory)}
      className={cn(
        "p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200",
        category === key
          ? "border-primary bg-accent text-primary scale-105"
          : "border-border bg-white hover:border-primary/50"
      )}
    >
      {label}
    </button>
  ));

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
              <Label>Category</Label>
              <div className="grid grid-cols-2 gap-3">
                {categoryButtons}
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
              className="w-full bg-gradient-honey hover:scale-105 transition-all duration-200 rounded-xl py-3 text-white font-medium shadow-soft"
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
