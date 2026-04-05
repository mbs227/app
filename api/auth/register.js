const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'manifest12';
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-here-change-in-production';

const client = new MongoClient(MONGO_URL);
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  
  await client.connect();
  const db = client.db(DB_NAME);
  cachedDb = db;
  return db;
}

function generateToken(userId) {
  return jwt.sign({ sub: userId }, SECRET_KEY, { expiresIn: '7d' });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, full_name } = req.body;
    
    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = await connectToDatabase();
    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = {
      id: require('crypto').randomUUID(),
      email,
      full_name,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      password_hash: hashedPassword
    };

    // Insert user
    await users.insertOne(user);

    // Generate token
    const access_token = generateToken(user.id);

    // Return user response (without password_hash)
    const userResponse = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      is_active: user.is_active,
      created_at: user.created_at
    };

    return res.status(200).json({
      access_token,
      token_type: 'bearer',
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};