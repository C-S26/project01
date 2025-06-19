import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed', error);
    process.exit(1);
  }
};

// Models
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String
});

const groupSchema = new mongoose.Schema({
  name: String
});

const messageSchema = new mongoose.Schema({
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: false },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: false },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);
const Group = mongoose.model('Group', groupSchema);
const Message = mongoose.model('Message', messageSchema);

// Routes
app.get('/contacts', async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

app.post('/contacts', async (req, res) => {
  const contact = new Contact(req.body);
  await contact.save();
  res.status(201).json(contact);
});

app.delete('/contacts/:id', async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ message: 'Contact deleted' });
});

app.get('/groups', async (req, res) => {
  const groups = await Group.find();
  res.json(groups);
});

app.post('/groups', async (req, res) => {
  const group = new Group(req.body);
  await group.save();
  res.status(201).json(group);
});

app.get('/messages', async (req, res) => {
  const messages = await Message.find().populate('to').populate('group');
  res.json(messages);
});

app.post('/messages', async (req, res) => {
  const { to, group, message } = req.body;
  const newMessage = new Message({ to, group, message });
  await newMessage.save();
  res.status(201).json(newMessage);
});

// Start server
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
