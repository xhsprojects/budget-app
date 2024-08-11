import React, { useState, useEffect } from 'react';
import { Sun, Moon, Plus, Trash, Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [newBudgetName, setNewBudgetName] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseDate, setNewExpenseDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  const addBudget = () => {
    if (newBudgetName && newBudgetAmount) {
      setBudgets([...budgets, { 
        id: Date.now(), 
        name: newBudgetName, 
        amount: parseFloat(newBudgetAmount), 
        expenses: [] 
      }]);
      setNewBudgetName('');
      setNewBudgetAmount('');
    }
  };

  const deleteBudget = (id) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
    if (selectedBudget && selectedBudget.id === id) {
      setSelectedBudget(null);
    }
  };

  const addExpense = () => {
    if (selectedBudget && newExpenseName && newExpenseAmount && newExpenseDate) {
      const updatedBudgets = budgets.map(budget => {
        if (budget.id === selectedBudget.id) {
          return {
            ...budget,
            expenses: [...budget.expenses, {
              id: Date.now(),
              name: newExpenseName,
              amount: parseFloat(newExpenseAmount),
              date: newExpenseDate
            }]
          };
        }
        return budget;
      });
      setBudgets(updatedBudgets);
      setSelectedBudget(updatedBudgets.find(b => b.id === selectedBudget.id));
      setNewExpenseName('');
      setNewExpenseAmount('');
      setNewExpenseDate('');
    }
  };

  const deleteExpense = (expenseId) => {
    const updatedBudgets = budgets.map(budget => {
      if (budget.id === selectedBudget.id) {
        return {
          ...budget,
          expenses: budget.expenses.filter(expense => expense.id !== expenseId)
        };
      }
      return budget;
    });
    setBudgets(updatedBudgets);
    setSelectedBudget(updatedBudgets.find(b => b.id === selectedBudget.id));
  };

  const editExpense = (expense) => {
    setEditingExpense({ ...expense });
  };

  const saveEditedExpense = () => {
    if (editingExpense) {
      const updatedBudgets = budgets.map(budget => {
        if (budget.id === selectedBudget.id) {
          return {
            ...budget,
            expenses: budget.expenses.map(expense => 
              expense.id === editingExpense.id ? editingExpense : expense
            )
          };
        }
        return budget;
      });
      setBudgets(updatedBudgets);
      setSelectedBudget(updatedBudgets.find(b => b.id === selectedBudget.id));
      setEditingExpense(null);
    }
  };

  const sortExpenses = (expenses) => {
    return expenses.sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (sortBy === 'date') {
        return sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'amount') {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
    });
  };

  const calculateRemainingBudget = (budget) => {
    const totalExpenses = budget.expenses.reduce((total, expense) => total + expense.amount, 0);
    return budget.amount - totalExpenses;
  };

  const calculateBudgetProgress = (budget) => {
    const totalExpenses = budget.expenses.reduce((total, expense) => total + expense.amount, 0);
    return (totalExpenses / budget.amount) * 100;
  };

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Aplikasi Budgeting</h1>
          <Button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>Tambah Budget Baru</CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Input 
                  placeholder="Nama Budget" 
                  value={newBudgetName} 
                  onChange={(e) => setNewBudgetName(e.target.value)} 
                />
                <Input 
                  type="number" 
                  placeholder="Jumlah Budget" 
                  value={newBudgetAmount} 
                  onChange={(e) => setNewBudgetAmount(e.target.value)} 
                />
                <Button onClick={addBudget}><Plus size={16} className="mr-2" /> Tambah Budget</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>Daftar Budget</CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {budgets.map(budget => (
                  <li key={budget.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{budget.name}</span>
                      <div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedBudget(budget)}><Edit size={16} /></Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteBudget(budget.id)}><Trash size={16} /></Button>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span>Total: Rp{budget.amount.toLocaleString()}</span>
                      <span className="mx-2">|</span>
                      <span>Sisa: Rp{calculateRemainingBudget(budget).toLocaleString()}</span>
                    </div>
                    <Progress value={calculateBudgetProgress(budget)} className="w-full" />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {selectedBudget && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{selectedBudget.name} - Pengeluaran</h2>
                <div className="text-sm">
                  <span>Total: Rp{selectedBudget.amount.toLocaleString()}</span>
                  <span className="mx-2">|</span>
                  <span>Sisa: Rp{calculateRemainingBudget(selectedBudget).toLocaleString()}</span>
                </div>
              </div>
              <Progress value={calculateBudgetProgress(selectedBudget)} className="w-full mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <Input 
                  placeholder="Nama Pengeluaran" 
                  value={newExpenseName} 
                  onChange={(e) => setNewExpenseName(e.target.value)} 
                />
                <Input 
                  type="number" 
                  placeholder="Jumlah Pengeluaran" 
                  value={newExpenseAmount} 
                  onChange={(e) => setNewExpenseAmount(e.target.value)} 
                />
                <Input 
                  type="date" 
                  value={newExpenseDate} 
                  onChange={(e) => setNewExpenseDate(e.target.value)} 
                />
                <Button onClick={addExpense}><Plus size={16} className="mr-2" /> Tambah Pengeluaran</Button>
              </div>

              <div className="flex space-x-2 mb-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Urutkan berdasarkan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nama</SelectItem>
                    <SelectItem value="date">Tanggal</SelectItem>
                    <SelectItem value="amount">Jumlah</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Urutan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Naik</SelectItem>
                    <SelectItem value="desc">Turun</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Nama</th>
                      <th className="text-left p-2">Jumlah</th>
                      <th className="text-left p-2">Tanggal</th>
                      <th className="text-left p-2">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortExpenses([...selectedBudget.expenses]).map(expense => (
                      <tr key={expense.id}>
                        <td className="p-2">
                          {editingExpense && editingExpense.id === expense.id ? (
                            <Input 
                              value={editingExpense.name} 
                              onChange={(e) => setEditingExpense({...editingExpense, name: e.target.value})}
                            />
                          ) : (
                            expense.name
                          )}
                        </td>
                        <td className="p-2">
                          {editingExpense && editingExpense.id === expense.id ? (
                            <Input 
                              type="number"
                              value={editingExpense.amount} 
                              onChange={(e) => setEditingExpense({...editingExpense, amount: parseFloat(e.target.value)})}
                            />
                          ) : (
                            `Rp${expense.amount.toLocaleString()}`
                          )}
                        </td>
                        <td className="p-2">
                          {editingExpense && editingExpense.id === expense.id ? (
                            <Input 
                              type="date"
                              value={editingExpense.date} 
                              onChange={(e) => setEditingExpense({...editingExpense, date: e.target.value})}
                            />
                          ) : (
                            expense.date
                          )}
                        </td>
                        <td className="p-2">
                          {editingExpense && editingExpense.id === expense.id ? (
                            <Button onClick={saveEditedExpense}><Save size={16} /></Button>
                          ) : (
                            <>
                              <Button variant="outline" size="sm" onClick={() => editExpense(expense)}><Edit size={16} /></Button>
                              <Button variant="destructive" size="sm" onClick={() => deleteExpense(expense.id)}><Trash size={16} /></Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default App;
