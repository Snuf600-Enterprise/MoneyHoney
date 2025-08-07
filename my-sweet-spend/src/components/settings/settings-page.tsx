
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Edit, Moon, Sun, Target, Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { CustomCategory, CategoryGoal, DEFAULT_CATEGORIES } from '@/types/finance';
import { toast } from 'sonner';

interface SettingsPageProps {
  onBack: () => void;
}

const SettingsPage = ({ onBack }: SettingsPageProps) => {
  const { theme, toggleTheme } = useTheme();
  
  // Load from localStorage
  const [categories, setCategories] = useState<CustomCategory[]>(() => {
    const saved = localStorage.getItem('honey-categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });
  
  const [goals, setGoals] = useState<CategoryGoal[]>(() => {
    const saved = localStorage.getItem('honey-goals');
    return saved ? JSON.parse(saved) : [];
  });

  // Dashboard customization
  const [dashboardSettings, setDashboardSettings] = useState(() => {
    const saved = localStorage.getItem('honey-dashboard-settings');
    return saved ? JSON.parse(saved) : {
      showRecentTransactions: true,
      showSpendingChart: true,
      showBudgetOverview: true,
      showAccountBalances: true,
      showGoalProgress: true
    };
  });

  const [newCategory, setNewCategory] = useState({ name: '', emoji: '📦', color: 'hsl(24, 100%, 58%)' });

  // Save to localStorage
  React.useEffect(() => {
    localStorage.setItem('honey-categories', JSON.stringify(categories));
  }, [categories]);

  React.useEffect(() => {
    localStorage.setItem('honey-goals', JSON.stringify(goals));
  }, [goals]);

  React.useEffect(() => {
    localStorage.setItem('honey-dashboard-settings', JSON.stringify(dashboardSettings));
  }, [dashboardSettings]);

  const addCategory = () => {
    if (!newCategory.name.trim()) return;
    
    const category: CustomCategory = {
      id: Date.now().toString(),
      name: newCategory.name,
      emoji: newCategory.emoji,
      color: newCategory.color
    };
    
    setCategories([...categories, category]);
    setNewCategory({ name: '', emoji: '📦', color: 'hsl(24, 100%, 58%)' });
    toast.success('Category added successfully!');
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    setGoals(goals.filter(goal => goal.category !== id));
    toast.success('Category deleted successfully!');
  };

  const setGoalForCategory = (categoryId: string, monthlyTarget: number) => {
    const existingGoal = goals.find(g => g.category === categoryId);
    const category = categories.find(cat => cat.id === categoryId);
    
    if (existingGoal) {
      setGoals(goals.map(goal => 
        goal.category === categoryId 
          ? { ...goal, monthlyTarget }
          : goal
      ));
    } else {
      const newGoal: CategoryGoal = {
        id: Date.now().toString(),
        category: categoryId,
        monthlyTarget,
        color: category?.color || 'hsl(24, 100%, 58%)'
      };
      setGoals([...goals, newGoal]);
    }
    toast.success('Goal updated successfully!');
  };

  const removeGoal = (categoryId: string) => {
    setGoals(goals.filter(goal => goal.category !== categoryId));
    toast.success('Goal removed successfully!');
  };

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Dark Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
            </div>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Dashboard Customization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(dashboardSettings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </p>
                <p className="text-sm text-muted-foreground">
                  Show this section on your dashboard
                </p>
              </div>
              <Switch 
                checked={value as boolean} 
                onCheckedChange={(checked) => 
                  setDashboardSettings(prev => ({ ...prev, [key]: checked }))
                } 
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Categories & Goals Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Categories & Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Category */}
          <div className="space-y-3">
            <h4 className="font-medium">Add New Category</h4>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>Name</Label>
                <Input
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Category name"
                />
              </div>
              <div>
                <Label>Emoji</Label>
                <Input
                  value={newCategory.emoji}
                  onChange={(e) => setNewCategory({ ...newCategory, emoji: e.target.value })}
                  maxLength={2}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addCategory} className="w-full">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </div>
          </div>

          {/* Categories List with Goals */}
          <div className="space-y-4">
            <h4 className="font-medium">Manage Categories & Set Goals</h4>
            {categories.map((category) => {
              const goal = goals.find(g => g.category === category.id);
              return (
                <div key={category.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{category.emoji}</span>
                      <span className="font-medium">{category.name}</span>
                      {goal && (
                        <Badge variant="secondary">
                          Goal: €{goal.monthlyTarget}/month
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCategory(category.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Monthly goal (€)"
                      defaultValue={goal?.monthlyTarget || ''}
                      className="flex-1"
                      id={`goal-${category.id}`}
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        const input = document.getElementById(`goal-${category.id}`) as HTMLInputElement;
                        const value = parseFloat(input.value);
                        if (value > 0) {
                          setGoalForCategory(category.id, value);
                        }
                      }}
                    >
                      {goal ? 'Update' : 'Set'} Goal
                    </Button>
                    {goal && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeGoal(category.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
