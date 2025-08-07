
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Income, Account, DEFAULT_ACCOUNTS } from '@/types/finance';
import { ArrowLeft } from 'lucide-react';

interface IncomeFormProps {
  onBack: () => void;
  onSave: (income: Income) => void;
}

const IncomeForm = ({ onBack, onSave }: IncomeFormProps) => {
  const accounts = React.useMemo(() => {
    const saved = localStorage.getItem('honey-accounts');
    return saved ? JSON.parse(saved) : DEFAULT_ACCOUNTS;
  }, []);

  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState(accounts[0]?.id || 'main');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    const income: Income = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      description,
      date,
      account,
    };

    onSave(income);
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
        <h1 className="text-2xl font-bold">Add Income</h1>
      </div>

      <Card className="shadow-soft border-0">
        <CardHeader>
          <CardTitle className="text-lg">New Income</CardTitle>
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
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Source of income"
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
              className="w-full bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-500 hover:to-cyan-600 hover:scale-105 transition-all duration-200 rounded-xl py-3 text-white font-medium shadow-soft"
            >
              Save Income
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncomeForm;
