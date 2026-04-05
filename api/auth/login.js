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
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = await connectToDatabase();
    const users = db.collection('users');

    // Find user
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }

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
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};