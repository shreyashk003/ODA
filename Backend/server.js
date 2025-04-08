const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let usersCollection, organsCollection, messagesCollection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db('ODA');
    usersCollection = db.collection('users');
    organsCollection = db.collection('organs');
    messagesCollection = db.collection('messages');
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}
connectDB();

// ✅ Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  try {
    const user = await usersCollection.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      role: user.role,
      userId: user._id,
      fullName: user.fullName,
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Get All Organs
app.get('/api/organs', async (req, res) => {
  try {
    const organs = await organsCollection.find({}).toArray();
    res.status(200).json(organs);
  } catch (err) {
    console.error('Error fetching organs:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch organs' });
  }
});

// ✅ Get Messages for a specific recipient
app.get('/api/messages', async (req, res) => {
  try {
    const { recipientId } = req.query;
    if (!recipientId) {
      return res.status(400).json({ success: false, message: 'Recipient ID required' });
    }
    const messages = await messagesCollection.find({ recipientId }).toArray();
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

// ✅ Send a Thank You Message
app.post('/api/messages', async (req, res) => {
  const { recipientId, donorId, organId, content, date } = req.body;

  if (!recipientId || !donorId || !organId || !content || !date) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const message = {
      recipientId,
      donorId,
      organId,
      content,
      date,
    };

    const result = await messagesCollection.insertOne(message);

    res.status(201).json({
      success: true,
      message: 'Thank you message sent successfully',
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error('Error sending message:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// Add this to your server.js file
app.post('/api/organs', async (req, res) => {
  try {
    const result = await organsCollection.insertOne(req.body);
    res.status(201).json({
      success: true,
      message: 'Organ registered successfully',
      organId: result.insertedId,
    });
  } catch (err) {
    console.error('Error registering organ:', err.message);
    res.status(500).json({ success: false, message: 'Failed to register organ' });
  }
});

// ✅ Get Donor Details by ID (for Donor Dashboard)
app.get('/api/donor/:id', async (req, res) => {
  try {
    const donorId = req.params.id;
    const donor = await usersCollection.findOne({ _id: new ObjectId(donorId) });

    if (!donor || donor.role !== 'donor') {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }

    const organs = await organsCollection.find({ donorId }).toArray();

    return res.status(200).json({
      success: true,
      donor: {
        id: donor._id,
        name: donor.fullName,
        email: donor.email,
        organs: organs,
      },
    });
  } catch (err) {
    console.error('Error fetching donor details:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});