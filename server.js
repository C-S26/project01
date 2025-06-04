const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow frontend requests
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/toy_Store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const bcrypt = require('bcrypt');

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = new Customer({ name, email, password: hashedPassword, address, phone });

    await newCustomer.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

//  Toy Schema & Model
const toySchema = new mongoose.Schema({
  name: String,
  categoryId: String,
  price: Number,
  image: String,
});
const Toy = mongoose.model('Toy', toySchema);

// Customer Schema & Model
// const customerSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String,
//   address: String,
//   phone: Number,
// });
// const Customer = mongoose.model('Customer', customerSchema);

//  Category Schema & Model
const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
});
const Category = mongoose.model('Category', categorySchema);

// ROUTES
const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  address: String,
  phone: String
});
const Customer = mongoose.model('Customer', customerSchema);

app.post('/api/customers', async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const customer = new Customer({ name, email, password, address, phone });
    const saved = await customer.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add customer' });
  }
});
 
// app.post('/api/login', async (req, res) => {       // yet to update -- 3-6-2025
//   try {
//     const { email, password } = req.body;
//     const user = await Customer.findOne({ email });

//     if (!user) return res.status(400).json({ error: 'Invalid email or password' });

//     const isValid = await bcrypt.compare(password, user.password);
//     if (!isValid) return res.status(400).json({ error: 'Invalid email or password' });

//     // For simplicity, just send user data back (no JWT/session here)
//     res.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email } });
//   } catch (err) {
//     res.status(500).json({ error: 'Login failed' });
//   }
// });


// Get all toys


app.get('/api/toys', async (req, res) => {
  try {
    const toys = await Toy.find();
    res.json(toys);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch toys' });
  }
});

// Add a new toy
app.post('/api/toys', async (req, res) => {
  try {
    const { name, categoryId, price, image } = req.body;
    const newToy = new Toy({ name, categoryId, price, image });
    const savedToy = await newToy.save();
    res.status(201).json(savedToy);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add toy' });
  }
});
app.delete('/api/toys/:id', async (req, res) => {
  try {
    const result = await Toy.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Toy not found' });
    res.json({ message: 'Toy deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete toy' });
  }
});


// Start server
app.listen(3000, () => {
  console.log('✅ Backend running at http://localhost:3000');
});
