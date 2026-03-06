require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;


mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  category: String,
  date: String
});

const Expense = mongoose.model("Expense", expenseSchema);



app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => {

  const expenses = await Expense.find().sort({_id:-1});

  const total = expenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  res.render('index', {
    expenses,
    total: total.toFixed(2)
  });

});



app.post('/add', async (req, res) => {

  const { description, amount, category } = req.body;

  if (description && amount && !isNaN(amount) && Number(amount) > 0) {

    await Expense.create({
      description: description.trim(),
      amount: Number(amount),
      category: category || "Other",
      date: new Date().toLocaleDateString("en-GB")
    });

  }

  res.redirect('/');

});


app.post('/delete/:id', async (req, res) => {

  await Expense.findByIdAndDelete(req.params.id);

  res.sendStatus(200);

});


app.listen(port, () => {
  console.log(
    `Expense Tracker running → http://localhost:${port}`
  );
});