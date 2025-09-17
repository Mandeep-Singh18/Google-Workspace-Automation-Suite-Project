import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';
import { User } from '../models/user';

/**
 * @desc    Get all tasks for the logged-in user
 */
export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authorized' });
  }
  try {
    const userId = (req.user as User).id;
    // FIX: Changed "userId" to userid and "createdAt" to createdat
    const { rows } = await pool.query(
      'SELECT * FROM tasks WHERE userid = $1 ORDER BY createdat DESC', 
      [userId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new task
 */
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authorized' });
  }
  try {
    const userId = (req.user as User).id;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    // FIX: Changed "userId" to userid
    const { rows } = await pool.query(
      'INSERT INTO tasks (userid, title) VALUES ($1, $2) RETURNING *',
      [userId, title]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update a task
 */
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authorized' });
  }
  try {
    const userId = (req.user as User).id;
    const taskId = parseInt(req.params.id);
    const { title, status } = req.body;

    // FIX: Changed "userId" to userid
    const { rows, rowCount } = await pool.query(
      'UPDATE tasks SET title = $1, status = $2 WHERE id = $3 AND userid = $4 RETURNING *',
      [title, status, taskId, userId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Task not found or user not authorized' });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a task
 */
export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authorized' });
  }
  try {
    const userId = (req.user as User).id;
    const taskId = parseInt(req.params.id);

    // FIX: Changed "userId" to userid
    const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1 AND userid = $2', [
      taskId,
      userId,
    ]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Task not found or user not authorized' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};