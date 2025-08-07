
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense, Income, CATEGORY_LABELS, CATEGORY_COLORS, ExpenseCategory } from '@/types/finance';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Euro, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface DashboardOverviewProps {
  expenses: Expense[];
  income: Income[];
}

const DashboardOverview = ({ expenses, income }: DashboardOverviewProps) => {
  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Calculate spending by category
  const categorySpending = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  const pieData = Object.entries(categorySpending).map(([category, amount]) => ({
    name: CATEGORY_LABELS[category as ExpenseCategory],
    value: amount,
    color: `hsl(var(--category-${category}))`
  }));

  // Recent expenses for the activity feed
  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const formatCurrency = (amount: number) => `€${amount.toFixed(2)}`;

  return (
    <div className="p-4 pb-24 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-honey">HoneyMoney</span>
        </h1>
        <p className="text-muted-foreground">Track your finances with ease</p>
      </div>

      {/* Balance Cards */}
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

        <Card className="bg-white shadow-soft border-0">
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

      {/* Spending Chart */}
      {pieData.length > 0 && (
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
      {recentExpenses.length > 0 && (
        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[expense.category]}`} />
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {CATEGORY_LABELS[expense.category]} • {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-destructive">-{formatCurrency(expense.amount)}</p>
              </div>
            ))}
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
