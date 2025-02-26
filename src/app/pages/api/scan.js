import { connectToDatabase } from '../../../utils/mongodb';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  const { qrCode } = req.body;
  const { db } = await connectToDatabase();

  const code = await db.collection('qrcodes').findOne({ code: qrCode });

  if (code) {
    const user = await db.collection('users').updateOne(
      { email: req.user.email },
      { $inc: { points: 1 } }
    );
    const updatedUser = await db.collection('users').findOne({ email: req.user.email });

    if (updatedUser.points === 100) {
      const uniqueCode = uuidv4().slice(0, 8); // Generate 8-digit alphanumeric code
      await db.collection('users').updateOne(
        { email: req.user.email },
        { $set: { uniqueCode } }
      );
      res.status(200).json({ points: updatedUser.points, uniqueCode });
    } else {
      res.status(200).json({ points: updatedUser.points });
    }
  } else {
    res.status(404).json({ message: 'QR code not found' });
  }
}
