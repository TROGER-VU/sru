import { connectToDatabase } from '../../../utils/mongodb';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  const user = await db.collection('users').updateOne(
    { email: req.user.email },
    { $set: { points: 0 } }
  );

  res.status(200).json({ message: 'Points redeemed successfully' });
}
