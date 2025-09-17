import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { protect } from '../middleware/authMiddleware';
import { UserModel, User } from '../models/user';

const router = express.Router();

// Route to start the Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// The callback route that Google redirects to
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).redirect('/?error=authfailed');
    }
    const token = jwt.sign({ id: (req.user as User).id }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect('http://localhost:3000/dashboard');
  }
);

// The /me route to get the current user's data
router.get('/me', protect, async (req, res) => {
  try {
    const user = await UserModel.findById((req.user as User).id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;