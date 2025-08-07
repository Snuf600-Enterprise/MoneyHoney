
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ThemeProvider } from '@/contexts/theme-context';
import MobileNav from '@/components/ui/mobile-nav';
import DashboardOverview from '@/components/dashboard/dashboard-overview';
import ExpenseForm from '@/components/dashboard/expense-form';
import IncomeForm from '@/components/dashboard/income-form';
import SettingsPage from '@/components/settings/settings-page';
import AccountsPage from '@/components/accounts/accounts-page';
import AnalyticsPage from '@/components/analytics/analytics-page';
import { Expense, Income } from '@/types/finance';

const IndexContent = () => {
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
        return <AnalyticsPage onBack={handleBackToDashboard} expenses={expenses} income={income} />;
      case 'settings':
        return <SettingsPage onBack={handleBackToDashboard} />;
      case 'accounts':
        return <AccountsPage onBack={handleBackToDashboard} />;
      default:
        return <DashboardOverview expenses={expenses} income={income} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft dark:bg-gray-900">
      <main className="max-w-md mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm min-h-screen">
        {renderContent()}
      </main>
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <IndexContent />
    </ThemeProvider>
  );
};

export default Index;
