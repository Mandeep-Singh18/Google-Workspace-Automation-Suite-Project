import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { createTables } from './config/db'; // <-- Import the function
import './config/passport'; // Import to configure passport strategy
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());


app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const startServer = async () => {
  try {
    await createTables();
    
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();