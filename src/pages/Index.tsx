
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import MobileNav from '@/components/ui/mobile-nav';
import DashboardOverview from '@/components/dashboard/dashboard-overview';
import ExpenseForm from '@/components/dashboard/expense-form';
import IncomeForm from '@/components/dashboard/income-form';
import { Expense, Income } from '@/types/finance';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('honey-expenses');
    const savedIncome = localStorage.getItem('honey-income');
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    if (savedIncome) {
      setIncome(JSON.parse(savedIncome));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('honey-expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('honey-income', JSON.stringify(income));
  }, [income]);

  const handleSaveExpense = (expense: Expense) => {
    setExpenses(prev => [expense, ...prev]);
    toast.success(`Expense of €${expense.amount} added successfully!`);
  };

  const handleSaveIncome = (incomeItem: Income) => {
    setIncome(prev => [incomeItem, ...prev]);
    toast.success(`Income of €${incomeItem.amount} added successfully!`);
  };

  const handleBackToDashboard = () => {
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview expenses={expenses} income={income} />;
      case 'add-expense':
        return <ExpenseForm onBack={handleBackToDashboard} onSave={handleSaveExpense} />;
      case 'add-income':
        return <IncomeForm onBack={handleBackToDashboard} onSave={handleSaveIncome} />;
      case 'analytics':
        return (
          <div className="p-4 pb-24 text-center">
            <h1 className="text-2xl font-bold mb-4">Analytics</h1>
            <p className="text-muted-foreground">Advanced analytics coming soon!</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-4 pb-24 text-center">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <p className="text-muted-foreground">Settings panel coming soon!</p>
          </div>
        );
      default:
        return <DashboardOverview expenses={expenses} income={income} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <main className="max-w-md mx-auto bg-white/50 backdrop-blur-sm min-h-screen">
        {renderContent()}
      </main>
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
