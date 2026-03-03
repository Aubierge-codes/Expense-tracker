const express = require('express');
const app = express();
const port = 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Parse form data
app.use(express.urlencoded({ extended: true }));

// In-memory storage (resets when server restarts)
let expenses = [];

// Home page - show list + form + total
app.get('/', (req, res) => {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  res.render('index', { 
    expenses, 
    total: total.toFixed(2)
  });
});

// Add new expense
app.post('/add', (req, res) => {
  const { description, amount, category } = req.body;
  
  if (description && amount && !isNaN(amount) && Number(amount) > 0) {
    expenses.push({
      id: Date.now(),
      description: description.trim(),
      amount: Number(amount),
      category: category || 'Other',
      date: new Date().toLocaleDateString('en-GB')
    });
  }
  
  res.redirect('/');
});

// Delete an expense
app.post('/delete/:id', (req, res) => {
  const id = Number(req.params.id);
  expenses = expenses.filter(exp => exp.id !== id);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Expense Tracker running → http://localhost:${port}`);
});