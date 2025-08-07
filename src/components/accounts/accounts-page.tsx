
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Wallet, Plus, ArrowRightLeft, Trash2, CreditCard, Banknote, PiggyBank } from 'lucide-react';
import { Account, Transfer, DEFAULT_ACCOUNTS } from '@/types/finance';
import { toast } from 'sonner';

interface AccountsPageProps {
  onBack: () => void;
}

const AccountsPage = ({ onBack }: AccountsPageProps) => {
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('honey-accounts');
    return saved ? JSON.parse(saved) : DEFAULT_ACCOUNTS;
  });

  const [transfers, setTransfers] = useState<Transfer[]>(() => {
    const saved = localStorage.getItem('honey-transfers');
    return saved ? JSON.parse(saved) : [];
  });

  const [newAccount, setNewAccount] = useState({
    name: '',
    balance: '',
    type: 'checking' as Account['type'],
    color: 'hsl(24, 100%, 58%)'
  });

  const [transferForm, setTransferForm] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: ''
  });

  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  // Save to localStorage
  React.useEffect(() => {
    localStorage.setItem('honey-accounts', JSON.stringify(accounts));
  }, [accounts]);

  React.useEffect(() => {
    localStorage.setItem('honey-transfers', JSON.stringify(transfers));
  }, [transfers]);

  const addAccount = () => {
    if (!newAccount.name.trim() || !newAccount.balance) return;

    const account: Account = {
      id: Date.now().toString(),
      name: newAccount.name,
      balance: Number(newAccount.balance),
      type: newAccount.type,
      color: newAccount.color
    };

    setAccounts([...accounts, account]);
    setNewAccount({ name: '', balance: '', type: 'checking', color: 'hsl(24, 100%, 58%)' });
    setIsAddAccountOpen(false);
    toast.success('Account added successfully!');
  };

  const deleteAccount = (id: string) => {
    if (accounts.length <= 1) {
      toast.error('You must have at least one account');
      return;
    }
    setAccounts(accounts.filter(acc => acc.id !== id));
    toast.success('Account deleted successfully!');
  };

  const handleTransfer = () => {
    if (!transferForm.fromAccount || !transferForm.toAccount || !transferForm.amount) return;
    if (transferForm.fromAccount === transferForm.toAccount) {
      toast.error('Cannot transfer to the same account');
      return;
    }

    const amount = Number(transferForm.amount);
    const fromAccount = accounts.find(acc => acc.id === transferForm.fromAccount);
    
    if (!fromAccount || fromAccount.balance < amount) {
      toast.error('Insufficient balance');
      return;
    }

    // Create transfer record
    const transfer: Transfer = {
      id: Date.now().toString(),
      amount,
      fromAccount: transferForm.fromAccount,
      toAccount: transferForm.toAccount,
      description: transferForm.description || 'Transfer',
      date: new Date().toISOString().split('T')[0]
    };

    // Update account balances
    const updatedAccounts = accounts.map(account => {
      if (account.id === transferForm.fromAccount) {
        return { ...account, balance: account.balance - amount };
      }
      if (account.id === transferForm.toAccount) {
        return { ...account, balance: account.balance + amount };
      }
      return account;
    });

    setAccounts(updatedAccounts);
    setTransfers([transfer, ...transfers]);
    setTransferForm({ fromAccount: '', toAccount: '', amount: '', description: '' });
    setIsTransferOpen(false);
    toast.success('Transfer completed successfully!');
  };

  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'savings': return <PiggyBank className="h-5 w-5" />;
      case 'credit': return <CreditCard className="h-5 w-5" />;
      case 'cash': return <Banknote className="h-5 w-5" />;
      default: return <Wallet className="h-5 w-5" />;
    }
  };

  const getAccountTypeBadge = (type: Account['type']) => {
    const colors = {
      checking: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      savings: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      credit: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      cash: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
    };

    return (
      <Badge className={colors[type]}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>← Back</Button>
          <h1 className="text-2xl font-bold">Accounts</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Transfer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Transfer Between Accounts</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>From Account</Label>
                  <select
                    className="w-full h-10 px-3 border rounded-md"
                    value={transferForm.fromAccount}
                    onChange={(e) => setTransferForm({ ...transferForm, fromAccount: e.target.value })}
                  >
                    <option value="">Select account</option>
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>{acc.name} (€{acc.balance.toFixed(2)})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>To Account</Label>
                  <select
                    className="w-full h-10 px-3 border rounded-md"
                    value={transferForm.toAccount}
                    onChange={(e) => setTransferForm({ ...transferForm, toAccount: e.target.value })}
                  >
                    <option value="">Select account</option>
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Amount (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={transferForm.amount}
                    onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Description (Optional)</Label>
                  <Input
                    value={transferForm.description}
                    onChange={(e) => setTransferForm({ ...transferForm, description: e.target.value })}
                    placeholder="Transfer description"
                  />
                </div>
                <Button onClick={handleTransfer} className="w-full">
                  Transfer Funds
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Account Name</Label>
                  <Input
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                    placeholder="Account name"
                  />
                </div>
                <div>
                  <Label>Initial Balance (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newAccount.balance}
                    onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Account Type</Label>
                  <select
                    className="w-full h-10 px-3 border rounded-md"
                    value={newAccount.type}
                    onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value as Account['type'] })}
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                    <option value="credit">Credit</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
                <Button onClick={addAccount} className="w-full">
                  Add Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Total Balance */}
      <Card className="bg-gradient-to-r from-amber-400 to-orange-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Total Balance</p>
              <p className="text-3xl font-bold">€{totalBalance.toFixed(2)}</p>
            </div>
            <Wallet className="h-8 w-8 text-white/80" />
          </div>
        </CardContent>
      </Card>

      {/* Accounts List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Accounts</h2>
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getAccountIcon(account.type)}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{account.name}</h3>
                      {getAccountTypeBadge(account.type)}
                    </div>
                    <p className="text-2xl font-bold text-primary">€{account.balance.toFixed(2)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteAccount(account.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Transfers */}
      {transfers.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Transfers</h2>
          {transfers.slice(0, 5).map((transfer) => {
            const fromAccount = accounts.find(acc => acc.id === transfer.fromAccount);
            const toAccount = accounts.find(acc => acc.id === transfer.toAccount);
            return (
              <Card key={transfer.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{transfer.description}</p>
                        <p className="text-sm text-muted-foreground">
                          From {fromAccount?.name} → {toAccount?.name} • {new Date(transfer.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-primary">€{transfer.amount.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AccountsPage;
