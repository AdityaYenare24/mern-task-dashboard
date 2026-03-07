import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';
import {
  sendTaskCreatedEmail,
  sendTaskCompletedEmail,
} from '../utils/emailService.js'; // ← ADD THIS

export const getTasks = asyncHandler(async (req, res) => {
  const { status, priority } = req.query;
  const filter = { user: req.user._id };
  if (status)   filter.status   = status;
  if (priority) filter.priority = priority;

  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: tasks.length, data: tasks });
});

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Task title is required');
  }

  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    status,
    priority,
    dueDate,
  });

  // ← ADD THIS — send task created email in background
  sendTaskCreatedEmail(req.user.name, req.user.email, task).catch(console.error);

  res.status(201).json({ success: true, data: task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  // ← ADD THIS — detect if task is being marked completed
  const isBeingCompleted =
    req.body.status === 'completed' && task.status !== 'completed';

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  // ← ADD THIS — send completion email in background
  if (isBeingCompleted) {
    sendTaskCompletedEmail(
      req.user.name,
      req.user.email,
      updatedTask
    ).catch(console.error);
  }

  res.status(200).json({ success: true, data: updatedTask });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this task');
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: { id: req.params.id },
  });
});

export const getTaskStats = asyncHandler(async (req, res) => {
  const stats = await Task.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const formatted = stats.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, { todo: 0, 'in-progress': 0, completed: 0 });

  res.status(200).json({ success: true, data: formatted });
});