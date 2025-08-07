
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Calendar, PieChart, Filter } from 'lucide-react';
import { Expense, Income, CategoryGoal, CustomCategory, DEFAULT_CATEGORIES } from '@/types/finance';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';

interface AnalyticsPageProps {
  onBack: () => void;
  expenses: Expense[];
  income: Income[];
}

const AnalyticsPage = ({ onBack, expenses, income }: AnalyticsPageProps) => {
  const [filterType, setFilterType] = useState<'preset' | 'custom' | 'month'>('preset');
  const [presetFilter, setPresetFilter] = useState<'week' | 'month' | '3months' | 'year'>('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0'));
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  // Load data from localStorage
  const categories = React.useMemo(() => {
    const saved = localStorage.getItem('honey-categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  }, []);

  const goals = React.useMemo(() => {
    const saved = localStorage.getItem('honey-goals');
    return saved ? JSON.parse(saved) : [];
  }, []);

  // Filter data based on selected period
  const getFilteredData = () => {
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    if (filterType === 'preset') {
      switch (presetFilter) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
    } else if (filterType === 'month') {
      const [year, month] = selectedMonth.split('-');
      startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      endDate = new Date(parseInt(year), parseInt(month), 0);
    } else if (filterType === 'custom') {
      if (customStartDate && customEndDate) {
        startDate = new Date(customStartDate);
        endDate = new Date(customEndDate);
      }
    }

    return {
      expenses: expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate >= startDate && expDate <= endDate;
      }),
      income: income.filter(inc => {
        const incDate = new Date(inc.date);
        return incDate >= startDate && incDate <= endDate;
      })
    };
  };

  const { expenses: filteredExpenses, income: filteredIncome } = getFilteredData();

  // Calculate spending by category
  const categorySpending = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Create chart data
  const pieData = Object.entries(categorySpending).map(([categoryId, amount]) => {
    const category = categories.find((cat: CustomCategory) => cat.id === categoryId);
    return {
      name: category ? `${category.emoji} ${category.name}` : categoryId,
      value: amount,
      color: category?.color || 'hsl(220, 70%, 50%)'
    };
  });

  // Calculate goal progress
  const goalProgress = goals.map((goal: CategoryGoal) => {
    const spent = categorySpending[goal.category] || 0;
    const progress = (spent / goal.monthlyTarget) * 100;
    const category = categories.find((cat: CustomCategory) => cat.id === goal.category);
    
    // Calculate projection based on current spending
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const daysPassed = new Date().getDate();
    const dailyAverage = spent / daysPassed;
    const projectedSpending = dailyAverage * daysInMonth;
    const projectedProgress = (projectedSpending / goal.monthlyTarget) * 100;

    return {
      ...goal,
      category: category,
      spent,
      progress,
      projectedSpending,
      projectedProgress,
      remaining: Math.max(0, goal.monthlyTarget - spent),
      status: progress > 100 ? 'exceeded' : progress > 80 ? 'warning' : 'good'
    };
  });

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalIncome = filteredIncome.reduce((sum, inc) => sum + inc.amount, 0);

  // Generate month options for the last 12 months
  const getMonthOptions = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
      const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      months.push({ value, label });
    }
    return months;
  };

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <h1 className="text-2xl font-bold">Analytics</h1>
      </div>

      {/* Period Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Time Period
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 mb-4">
            {[
              { key: 'preset', label: 'Quick Select' },
              { key: 'month', label: 'By Month' },
              { key: 'custom', label: 'Custom Range' }
            ].map((type) => (
              <Button
                key={type.key}
                variant={filterType === type.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType(type.key as any)}
              >
                {type.label}
              </Button>
            ))}
          </div>

          {filterType === 'preset' && (
            <div className="flex gap-2">
              {([
                { key: 'week', label: 'Past Week' },
                { key: 'month', label: 'Past Month' },
                { key: '3months', label: 'Past 3 Months' },
                { key: 'year', label: 'Past Year' }
              ] as const).map((period) => (
                <Button
                  key={period.key}
                  variant={presetFilter === period.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPresetFilter(period.key)}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          )}

          {filterType === 'month' && (
            <div>
              <Label>Select Month</Label>
              <select
                className="w-full h-10 px-3 border rounded-md"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {getMonthOptions().map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {filterType === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-amber-400 to-orange-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Spent</p>
                <p className="text-2xl font-bold">€{totalExpenses.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Income</p>
                <p className="text-2xl font-bold">€{totalIncome.toFixed(2)}</p>
              </div>
              <Calendar className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Net Balance</p>
                <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  €{(totalIncome - totalExpenses).toFixed(2)}
                </p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Goals Progress */}
      {goalProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Category Goals Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goalProgress.map((goal: any) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{goal.category?.emoji}</span>
                    <span className="font-medium">{goal.category?.name}</span>
                    <Badge variant={goal.status === 'exceeded' ? 'destructive' : goal.status === 'warning' ? 'secondary' : 'default'}>
                      {goal.status === 'exceeded' ? 'Over Budget' : goal.status === 'warning' ? 'Near Limit' : 'On Track'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">€{goal.spent.toFixed(2)} / €{goal.monthlyTarget.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Projected: €{goal.projectedSpending.toFixed(2)}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Progress value={Math.min(goal.progress, 100)} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{goal.progress.toFixed(1)}% used</span>
                    <span>Projection: {goal.projectedProgress.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Spending Breakdown */}
      {pieData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Spending Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
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
                  <Tooltip formatter={(value: number) => [`€${value.toFixed(2)}`, 'Amount']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsPage;
