import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';
import { User } from '../models/user'; // <-- STEP 1: IMPORT THE USER TYPE

/**
 * @desc    Get all tasks for the logged-in user
 * @route   GET /api/tasks
 * @access  Private
 */
export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authorized' });
  }
  try {
    // STEP 2: APPLY THE TYPE ASSERTION
    const userId = (req.user as User).id;
    const { rows } = await pool.query('SELECT * FROM tasks WHERE "userId" = $1 ORDER BY "createdAt" DESC', [userId]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authorized' });
  }
  try {
    const userId = (req.user as User).id; // APPLY THE FIX
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const { rows } = await pool.query(
      'INSERT INTO tasks ("userId", title) VALUES ($1, $2) RETURNING *',
      [userId, title]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authorized' });
  }
  try {
    const userId = (req.user as User).id; // APPLY THE FIX
    const taskId = parseInt(req.params.id);
    const { title, status } = req.body;

    const { rows, rowCount } = await pool.query(
      'UPDATE tasks SET title = $1, status = $2 WHERE id = $3 AND "userId" = $4 RETURNING *',
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
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authorized' });
  }
  try {
    const userId = (req.user as User).id; // APPLY THE FIX
    const taskId = parseInt(req.params.id);

    const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1 AND "userId" = $2', [
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