import User from '../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectToDb from '../../lib/db';

export default async (req, res) => {
  await connectToDb();
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Nieprawidłowy username lub hasło');
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token, userId: user.id, username: user.username });
};
