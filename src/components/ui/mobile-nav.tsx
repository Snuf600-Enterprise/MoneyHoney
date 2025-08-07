
import React, { useState } from 'react';
import { Home, Plus, BarChart3, Settings, X, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileNav = ({ activeTab, onTabChange }: MobileNavProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'accounts', icon: Wallet, label: 'Accounts' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-border z-50 dark:bg-gray-900/90">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item, index) => (
            <React.Fragment key={item.id}>
              {index === 2 && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-gradient-honey text-white p-4 rounded-2xl shadow-soft hover:scale-105 transition-all duration-200 -mt-6 animate-bounce-gentle"
                >
                  <Plus size={24} />
                </button>
              )}
              <button
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 min-w-[60px]",
                  activeTab === item.id 
                    ? "text-primary bg-accent" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon size={18} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </React.Fragment>
          ))}
        </div>
      </nav>

      {/* Quick Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-md p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Quick Add</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  onTabChange('add-expense');
                }}
                className="bg-gradient-honey text-white p-4 rounded-2xl text-center shadow-soft hover:scale-105 transition-all duration-200"
              >
                <Plus size={24} className="mx-auto mb-2" />
                <span className="font-medium">Add Expense</span>
              </button>
              
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  onTabChange('add-income');
                }}
                className="bg-gradient-ocean text-white p-4 rounded-2xl text-center shadow-soft hover:scale-105 transition-all duration-200"
              >
                <Plus size={24} className="mx-auto mb-2" />
                <span className="font-medium">Add Income</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
