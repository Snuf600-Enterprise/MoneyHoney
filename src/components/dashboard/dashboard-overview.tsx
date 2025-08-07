
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Expense, Income, CustomCategory, DEFAULT_CATEGORIES, Account, DEFAULT_ACCOUNTS } from '@/types/finance';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Euro, TrendingUp, TrendingDown, Wallet, Eye, EyeOff, Target, Calendar, PieChart as PieChartIcon } from 'lucide-react';

interface DashboardOverviewProps {
  expenses: Expense[];
  income: Income[];
}

const DashboardOverview = ({ expenses, income }: DashboardOverviewProps) => {
  // Load data from localStorage
  const [categories] = useState<CustomCategory[]>(() => {
    const saved = localStorage.getItem('honey-categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [accounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('honey-accounts');
    return saved ? JSON.parse(saved) : DEFAULT_ACCOUNTS;
  });

  const [goals] = useState(() => {
    const saved = localStorage.getItem('honey-goals');
    return saved ? JSON.parse(saved) : [];
  });

  // Dashboard customization
  const [visibleSections, setVisibleSections] = useState(() => {
    const saved = localStorage.getItem('honey-dashboard-sections');
    return saved ? JSON.parse(saved) : {
      balance: true,
      spending: true,
      goals: true,
      accounts: true,
      recent: true
    };
  });

  React.useEffect(() => {
    localStorage.setItem('honey-dashboard-sections', JSON.stringify(visibleSections));
  }, [visibleSections]);

  const toggleSection = (section: string) => {
    setVisibleSections((prev: any) => ({ ...prev, [section]: !prev[section] }));
  };

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Calculate spending by category
  const categorySpending = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categorySpending).map(([categoryId, amount]) => {
    const category = categories.find(cat => cat.id === categoryId);
    return {
      name: category ? `${category.emoji} ${category.name}` : categoryId,
      value: amount,
      color: category?.color || 'hsl(var(--muted))'
    };
  });

  // Calculate account balances including transactions
  const accountBalances = accounts.map(account => {
    const accountExpenses = expenses
      .filter(exp => exp.account === account.id)
      .reduce((sum, exp) => sum + exp.amount, 0);
    
    const accountIncome = income
      .filter(inc => inc.account === account.id)
      .reduce((sum, inc) => sum + inc.amount, 0);

    const transfers = JSON.parse(localStorage.getItem('honey-transfers') || '[]');
    const transfersIn = transfers
      .filter((t: any) => t.toAccount === account.id)
      .reduce((sum: number, t: any) => sum + t.amount, 0);
    
    const transfersOut = transfers
      .filter((t: any) => t.fromAccount === account.id)
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    return {
      ...account,
      currentBalance: account.balance + accountIncome + transfersIn - accountExpenses - transfersOut
    };
  });

  // Recent expenses for the activity feed
  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Goal progress
  const goalProgress = goals.map((goal: any) => {
    const spent = categorySpending[goal.category] || 0;
    const progress = (spent / goal.monthlyTarget) * 100;
    const category = categories.find(cat => cat.id === goal.category);
    return {
      ...goal,
      category,
      spent,
      progress,
      remaining: Math.max(0, goal.monthlyTarget - spent)
    };
  });

  const formatCurrency = (amount: number) => `€${amount.toFixed(2)}`;

  const getSectionIcon = (section: string) => {
    const icons = {
      balance: Wallet,
      spending: PieChartIcon,
      goals: Target,
      accounts: Wallet,
      recent: Calendar
    };
    const Icon = icons[section as keyof typeof icons];
    return Icon ? <Icon className="h-4 w-4" /> : null;
  };

  return (
    <div className="p-4 pb-24 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-honey">HoneyMoney</span>
        </h1>
        <p className="text-muted-foreground">Track your finances with ease</p>
      </div>

      {/* Dashboard Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Customize Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(visibleSections).map(([section, visible]) => (
              <Button
                key={section}
                variant={visible ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleSection(section)}
                className="capitalize"
              >
                {getSectionIcon(section)}
                <span className="ml-1">{section}</span>
                {visible ? <Eye className="h-3 w-3 ml-1" /> : <EyeOff className="h-3 w-3 ml-1" />}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Balance Cards */}
      {visibleSections.balance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-honey text-white shadow-soft border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Balance</p>
                  <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
                </div>
                <Wallet className="h-8 w-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-ocean text-white shadow-soft border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Income</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-soft border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Expenses</p>
                  <p className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-destructive/60" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Account Overview */}
      {visibleSections.accounts && accountBalances.length > 0 && (
        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Account Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {accountBalances.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: account.color }} />
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                    </Badge>
                  </div>
                </div>
                <p className="font-semibold text-primary">{formatCurrency(account.currentBalance)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Goal Progress */}
      {visibleSections.goals && goalProgress.length > 0 && (
        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goalProgress.slice(0, 3).map((goal: any) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{goal.category?.emoji}</span>
                    <span className="font-medium">{goal.category?.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(goal.spent)} / {formatCurrency(goal.monthlyTarget)}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(goal.remaining)} remaining</p>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(goal.progress, 100)}%`,
                      backgroundColor: goal.category?.color || 'hsl(var(--primary))'
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Spending Chart */}
      {visibleSections.spending && pieData.length > 0 && (
        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Euro className="h-5 w-5" />
              Spending Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-muted-foreground truncate">
                    {entry.name}: {formatCurrency(entry.value)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {visibleSections.recent && recentExpenses.length > 0 && (
        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentExpenses.map((expense) => {
              const category = categories.find(cat => cat.id === expense.category);
              const account = accounts.find(acc => acc.id === expense.account);
              return (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category?.color || 'hsl(var(--muted))' }}
                    />
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {category ? `${category.emoji} ${category.name}` : expense.category} • {account?.name} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-destructive">-{formatCurrency(expense.amount)}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {expenses.length === 0 && (
        <Card className="shadow-soft border-0">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Euro className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Start tracking your expenses</h3>
            <p className="text-muted-foreground mb-4">
              Tap the + button to add your first expense and start managing your finances!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardOverview;
