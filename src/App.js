import React, { useState, useEffect } from 'react';
import { Moon, Sun, Edit, Trash, Calendar } from 'lucide-react';
import './App.css';

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [budgets, setBudgets] = useState(() => {
    const savedBudgets = localStorage.getItem('budgets');
    return savedBudgets ? JSON.parse(savedBudgets) : [];
  });
  const [newBudgetName, setNewBudgetName] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseDate, setNewExpenseDate] = useState('');
  const [sortBy, setSortBy] = useState('Tanggal');
  const [sortOrder, setSortOrder] = useState('Naik');
  const [editingBudget, setEditingBudget] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addBudget = () => {
    if (newBudgetName && newBudgetAmount) {
      const newBudget = {
        id: Date.now(),
        name: newBudgetName,
        amount: parseFloat(newBudgetAmount),
        expenses: []
      };
      setBudgets([...budgets, newBudget]);
      setNewBudgetName('');
      setNewBudgetAmount('');
    }
  };

  const updateBudget = () => {
    if (editingBudget) {
      setBudgets(budgets.map(budget => 
        budget.id === editingBudget.id ? editingBudget : budget
      ));
      setEditingBudget(null);
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
      const newExpense = {
        id: Date.now(),
        name: newExpenseName,
        amount: parseFloat(newExpenseAmount),
        date: newExpenseDate
      };
      const updatedBudgets = budgets.map(budget => 
        budget.id === selectedBudget.id 
          ? { ...budget, expenses: [...budget.expenses, newExpense] }
          : budget
      );
      setBudgets(updatedBudgets);
      setSelectedBudget({ ...selectedBudget, expenses: [...selectedBudget.expenses, newExpense] });
      setNewExpenseName('');
      setNewExpenseAmount('');
      setNewExpenseDate('');
    }
  };

  const updateExpense = () => {
    if (editingExpense && selectedBudget) {
      const updatedBudgets = budgets.map(budget => 
        budget.id === selectedBudget.id
          ? { ...budget, expenses: budget.expenses.map(expense => 
              expense.id === editingExpense.id ? editingExpense : expense
            )}
          : budget
      );
      setBudgets(updatedBudgets);
      setSelectedBudget({
        ...selectedBudget,
        expenses: selectedBudget.expenses.map(expense => 
          expense.id === editingExpense.id ? editingExpense : expense
        )
      });
      setEditingExpense(null);
    }
  };

  const deleteExpense = (expenseId) => {
    const updatedBudgets = budgets.map(budget => 
      budget.id === selectedBudget.id
        ? { ...budget, expenses: budget.expenses.filter(expense => expense.id !== expenseId) }
        : budget
    );
    setBudgets(updatedBudgets);
    setSelectedBudget({
      ...selectedBudget,
      expenses: selectedBudget.expenses.filter(expense => expense.id !== expenseId)
    });
  };

  const calculateRemaining = (budget) => {
    const totalExpenses = budget.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    return budget.amount - totalExpenses;
  };

  const sortExpenses = (expenses) => {
    return expenses.sort((a, b) => {
      if (sortBy === 'Tanggal') {
        return sortOrder === 'Naik' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'Jumlah') {
        return sortOrder === 'Naik' ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <header>
        <h1>Aplikasi Budgeting </h1>
        <button className="mode-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>
      <main>
        <div className="card">
          <h2>Tambah Budget Baru</h2>
          <input
            type="text"
            placeholder="Nama Budget"
            value={newBudgetName}
            onChange={(e) => setNewBudgetName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Jumlah Budget"
            value={newBudgetAmount}
            onChange={(e) => setNewBudgetAmount(e.target.value)}
          />
          <button onClick={addBudget}>+ Tambah Budget</button>
        </div>
        <div className="card">
          <h2>Daftar Budget</h2>
          {budgets.map(budget => (
            <div key={budget.id} className="budget-item">
              {editingBudget && editingBudget.id === budget.id ? (
                <>
                  <input
                    type="text"
                    value={editingBudget.name}
                    onChange={(e) => setEditingBudget({...editingBudget, name: e.target.value})}
                  />
                  <input
                    type="number"
                    value={editingBudget.amount}
                    onChange={(e) => setEditingBudget({...editingBudget, amount: parseFloat(e.target.value)})}
                  />
                  <button onClick={updateBudget}>Simpan</button>
                  <button onClick={() => setEditingBudget(null)}>Batal</button>
                </>
              ) : (
                <>
                  <div className="budget-header">
                    <span>{budget.name}</span>
                    <div>
                      <button className="icon-button" onClick={() => setEditingBudget(budget)}><Edit size={16} /></button>
                      <button className="icon-button" onClick={() => deleteBudget(budget.id)}><Trash size={16} /></button>
                    </div>
                  </div>
                  <div className="budget-details">
                    <span>Total: Rp{budget.amount.toLocaleString()} | Sisa: Rp{calculateRemaining(budget).toLocaleString()}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress" style={{width: `${(1 - calculateRemaining(budget) / budget.amount) * 100}%`}}></div>
                  </div>
                  <button onClick={() => setSelectedBudget(budget)}>Lihat Pengeluaran</button>
                </>
              )}
            </div>
          ))}
        </div>
        {selectedBudget && (
          <div className="card">
            <h2>{selectedBudget.name} - Pengeluaran</h2>
            <div className="budget-details">
              <span>Total: Rp{selectedBudget.amount.toLocaleString()} | Sisa: Rp{calculateRemaining(selectedBudget).toLocaleString()}</span>
            </div>
            <div className="progress-bar">
              <div className="progress" style={{width: `${(1 - calculateRemaining(selectedBudget) / selectedBudget.amount) * 100}%`}}></div>
            </div>
            <input
              type="text"
              placeholder="Nama Pengeluaran"
              value={newExpenseName}
              onChange={(e) => setNewExpenseName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Jumlah Pengeluaran"
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
            />
            <div className="date-input">
              <Calendar size={16} />
              <input
                type="date"
                value={newExpenseDate}
                onChange={(e) => setNewExpenseDate(e.target.value)}
              />
            </div>
            <button onClick={addExpense}>+ Tambah Pengeluaran</button>
            <div className="sort-controls">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option>Tanggal</option>
                <option>Jumlah</option>
              </select>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option>Naik</option>
                <option>Turun</option>
              </select>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Jumlah</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sortExpenses(selectedBudget.expenses).map(expense => (
                  <tr key={expense.id}>
                    {editingExpense && editingExpense.id === expense.id ? (
                      <>
                        <td><input type="text" value={editingExpense.name} onChange={(e) => setEditingExpense({...editingExpense, name: e.target.value})} /></td>
                        <td><input type="number" value={editingExpense.amount} onChange={(e) => setEditingExpense({...editingExpense, amount: parseFloat(e.target.value)})} /></td>
                        <td><input type="date" value={editingExpense.date} onChange={(e) => setEditingExpense({...editingExpense, date: e.target.value})} /></td>
                        <td>
                          <button onClick={updateExpense}>Simpan</button>
                          <button onClick={() => setEditingExpense(null)}>Batal</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{expense.name}</td>
                        <td>Rp{expense.amount.toLocaleString()}</td>
                        <td>{expense.date}</td>
                        <td>
                          <button className="icon-button" onClick={() => setEditingExpense(expense)}><Edit size={16} /></button>
                          <button className="icon-button" onClick={() => deleteExpense(expense.id)}><Trash size={16} /></button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
