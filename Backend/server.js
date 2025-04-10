const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 5000;
const fs = require('fs');
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db, usersCollection, organsCollection, messagesCollection, requestsCollection , healthStatusCollection;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('ODA');

    usersCollection = db.collection('users');
    organsCollection = db.collection('organs');
    messagesCollection = db.collection('messages');
    requestsCollection = db.collection('requests');
    healthStatusCollection=db.collection('healthstatus')

    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}
connectDB();

// ✅ Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password required' });

  try {
    const user = await usersCollection.findOne({ username });
    if (!user || user.password !== password) return res.status(401).json({ success: false, message: 'Invalid credentials' });

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

app.post('/api/db/reset', async (req, res) => {
  try {
    const db = client.db('ODA');
    const collections = await db.collections();

    for (const collection of collections) {
      if (!collection.collectionName.startsWith('system.')) {
        await collection.deleteMany({});
      }
    }

    res.status(200).json({ success: true, message: 'Database reset successful' });
  } catch (err) {
    console.error('❌ Reset error:', err.message);
    res.status(500).json({ success: false, message: 'Reset failed' });
  }
});


let notificationsCollection;

// Connect to the notifications collection after DB connection
async function connectNotifications() {
  try {
    await client.connect();
    const db = client.db('ODA');
    notificationsCollection = db.collection('notifications');
  } catch (err) {
    console.error('❌ Notification DB connection failed:', err.message);
  }
}
connectNotifications();

// ✅ PATCH: Mark notification as read
app.patch('/api/notifications/:id/read', async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid notification ID' });
  }

  try {
    const result = await notificationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'read', readAt: new Date() } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: 'Notification not found or already read' });
    }

    res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    console.error('❌ Error updating notification status:', err.message);
    res.status(500).json({ success: false, message: 'Failed to update notification' });
  }
});

app.post('/api/register-organ', async (req, res) => {
  try {
    const organData = req.body;
    await organsCollection.insertOne(organData);

    res.status(201).json({ message: 'Organ registered successfully' });
  } catch (err) {
    console.error('❌ Organ registration failed:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ GET: Fetch all notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await notificationsCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.status(200).json(notifications);
  } catch (err) {
    console.error('❌ Error fetching notifications:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

// ✅ POST: Add new notification (optional)
app.post('/api/notifications', async (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) return res.status(400).json({ success: false, message: 'Title and message required' });

  try {
    const result = await notificationsCollection.insertOne({ title, message, createdAt: new Date() });
    res.status(201).json({ success: true, message: 'Notification created', id: result.insertedId });
  } catch (err) {
    console.error('❌ Error creating notification:', err.message);
    res.status(500).json({ success: false, message: 'Failed to create notification' });
  }
});

// --- Inside your Express app (e.g., server.js or routes/settings.js) ---

let settings = {
  theme: 'light',
  notifications: true,
};

app.get('/api/settings', (req, res) => {
  res.json(settings);
});

app.post('/api/settings', (req, res) => {
  const { theme, notifications } = req.body;
  settings = { theme, notifications };
  res.json({ message: 'Settings updated successfully' });
});


// ✅ Get All Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await usersCollection.find({}).toArray();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// ✅ Delete User
app.delete('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  if (!ObjectId.isValid(userId)) return res.status(400).json({ success: false, message: 'Invalid user ID' });

  try {
    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });
    if (result.deletedCount === 0) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
});

// ✅ Get All Requests
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await requestsCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.status(200).json(requests);
  } catch (err) {
    console.error('❌ Error fetching organ requests:', err.message);
    res.status(500).json({ message: 'Server error while fetching requests' });
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
 // GET /api/messages - Fetch all messages
 app.get('/api/messages', async (req, res) => {
  try {
    const messages = await messagesCollection.find().sort({ date: -1 }).toArray();
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET current health status of recipient
app.get('/api/recipient', async (req, res) => {
  try {
    const recipientId = req.query.id; // optional if using login
    const health = await db.collection('healthstatus').findOne({ recipientId });
    res.json(health);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch health status' });
  }
});

// POST to update health status of recipient
app.post('/api/update', async (req, res) => {
  try {
    const data = req.body;
    await db.collection('healthstatus').updateOne(
      { recipientId: data.recipientId },
      { $set: data },
      { upsert: true }
    );
    res.json({ message: 'Health status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update health status' });
  }
});


app.get("/organs", async (req, res) => {
  try {
    const organs = await db.collection("organs").find().toArray();
    res.status(200).json(organs);
  } catch (err) {
    console.error("Failed to fetch organs:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get('/api/profile', async (req, res) => {
  try {
    const profile = await db.collection('users').findOne({ username: 'Vinayak' }); // or by _id/email
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ Get Messages for Recipient
app.get('/api/messages', async (req, res) => {
  try {
    const { recipientId } = req.query;
    if (!recipientId) return res.status(400).json({ success: false, message: 'Recipient ID required' });

    const messages = await messagesCollection.find({ recipientId }).toArray();
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

// ✅ Post Message
app.post('/api/messages', async (req, res) => {
  const { recipientId, donorId, organId, content, date } = req.body;

  if (!recipientId || !donorId || !organId || !content || !date) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const message = { recipientId, donorId, organId, content, date };
    const result = await messagesCollection.insertOne(message);
    res.status(201).json({ success: true, message: 'Message sent', insertedId: result.insertedId });
  } catch (err) {
    console.error('Error sending message:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// ✅ Register Organ
app.post('/api/organs', async (req, res) => {
  try {
    const result = await organsCollection.insertOne(req.body);
    res.status(201).json({ success: true, message: 'Organ registered', organId: result.insertedId });
  } catch (err) {
    console.error('Error registering organ:', err.message);
    res.status(500).json({ success: false, message: 'Failed to register organ' });
  }
});

app.get('/api/db/backup', async (req, res) => {
  try {
    const db = client.db('ODA');
    const collections = await db.collections();

    const backupData = {};

    for (const collection of collections) {
      const data = await collection.find({}).toArray();
      backupData[collection.collectionName] = data;
    }

    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filePath = path.join(backupDir, `backup-${timestamp}.json`);
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));

    res.status(200).json({ success: true, message: 'Backup successful', file: filePath });
  } catch (err) {
    console.error('❌ Backup error:', err.message);
    res.status(500).json({ success: false, message: 'Backup failed' });
  }
});

// ✅ Get Donor Details
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
        organs,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await db.collection('requests')
      .find({})
      .sort({ timestamp: -1 }) // most recent first
      .toArray();

    res.status(200).json(requests);
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
