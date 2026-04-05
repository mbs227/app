const { MongoClient } = require('mongodb');
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

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const db = await connectToDatabase();
    const users = db.collection('users');

    // Find user
    const user = await users.findOne({ id: decoded.sub });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Return user response (without password_hash)
    const userResponse = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      is_active: user.is_active,
      created_at: user.created_at
    };

    return res.status(200).json(userResponse);

  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};