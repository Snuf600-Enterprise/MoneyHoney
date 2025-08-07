
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Edit, Moon, Sun, Target } from 'lucide-react';
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

  const [newCategory, setNewCategory] = useState({ name: '', emoji: '📦', color: 'hsl(var(--honey-primary))' });
  const [newGoal, setNewGoal] = useState({ category: '', monthlyTarget: '', description: '' });

  // Save to localStorage
  React.useEffect(() => {
    localStorage.setItem('honey-categories', JSON.stringify(categories));
  }, [categories]);

  React.useEffect(() => {
    localStorage.setItem('honey-goals', JSON.stringify(goals));
  }, [goals]);

  const addCategory = () => {
    if (!newCategory.name.trim()) return;
    
    const category: CustomCategory = {
      id: Date.now().toString(),
      name: newCategory.name,
      emoji: newCategory.emoji,
      color: newCategory.color
    };
    
    setCategories([...categories, category]);
    setNewCategory({ name: '', emoji: '📦', color: 'hsl(var(--honey-primary))' });
    toast.success('Category added successfully!');
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    setGoals(goals.filter(goal => goal.category !== id));
    toast.success('Category deleted successfully!');
  };

  const addGoal = () => {
    if (!newGoal.category || !newGoal.monthlyTarget) return;
    
    const goal: CategoryGoal = {
      id: Date.now().toString(),
      category: newGoal.category,
      monthlyTarget: Number(newGoal.monthlyTarget),
      description: newGoal.description,
      color: categories.find(cat => cat.id === newGoal.category)?.color || 'hsl(var(--honey-primary))'
    };
    
    setGoals([...goals, goal]);
    setNewGoal({ category: '', monthlyTarget: '', description: '' });
    toast.success('Goal added successfully!');
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
    toast.success('Goal deleted successfully!');
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

      {/* Custom Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

          {/* Categories List */}
          <div className="space-y-2">
            <h4 className="font-medium">Your Categories</h4>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <span>{category.emoji}</span>
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCategory(category.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Category Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Goal */}
          <div className="space-y-3">
            <h4 className="font-medium">Set Monthly Goal</h4>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label>Category</Label>
                <select
                  className="w-full h-10 px-3 border rounded-md"
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Monthly Target (€)</Label>
                  <Input
                    type="number"
                    value={newGoal.monthlyTarget}
                    onChange={(e) => setNewGoal({ ...newGoal, monthlyTarget: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addGoal} className="w-full">
                    <Plus className="h-4 w-4 mr-1" /> Add Goal
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Goals List */}
          <div className="space-y-2">
            <h4 className="font-medium">Active Goals</h4>
            {goals.length > 0 ? (
              <div className="space-y-2">
                {goals.map((goal) => {
                  const category = categories.find(cat => cat.id === goal.category);
                  return (
                    <div key={goal.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span>{category?.emoji}</span>
                        <div>
                          <p className="font-medium">{category?.name}</p>
                          <p className="text-sm text-muted-foreground">€{goal.monthlyTarget}/month</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteGoal(goal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No goals set yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
