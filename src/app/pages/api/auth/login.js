// pages/api/login.js

import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../utils/mongodb';

export default async function handler(req, res) {
  const { email, password } = req.body;
  const { db } = await connectToDatabase();

  const user = await db.collection('users').findOne({ email });

  if (user && user.password === password) {
    const token = jwt.sign({ email: user.email, points: user.points }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
}
