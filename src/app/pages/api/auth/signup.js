import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../utils/mongodb';

export default async function handler(req, res) {
  const { email, password } = req.body;
  const { db } = await connectToDatabase();

  const user = await db.collection('users').insertOne({ email, password, points: 0 });

  const token = jwt.sign({ email: user.email, points: user.points }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(201).json({ token });
}
