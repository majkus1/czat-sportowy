import mongoose from 'mongoose';
import User from '../../models/User';
import bcrypt from 'bcrypt';
import connectToDb from '../../lib/db';
import jwt from 'jsonwebtoken';

export default async (req, res) => {
  await connectToDb();
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password, username } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).send('Użytkownik z tym adresem email już istnieje');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword, username });
  await user.save();

  // Generowanie tokena JWT dla użytkownika
  const token = jwt.sign(
    { userId: user._id, email: user.email }, 
    'SECRET_KEY', // użyj unikalnego klucza dla swojej aplikacji; najlepiej przechowuj go w zmiennych środowiskowych
    { expiresIn: '1h' } // token wygaśnie po 1 godzinie
  );

  res.status(201).json({ token, message: "Zarejestrowano", username: user.username });
};
