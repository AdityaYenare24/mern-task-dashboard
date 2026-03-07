import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All task routes are protected — every request must carry a valid JWT
router.use(protect);

router.route('/')
  .get(getTasks)      // GET    /api/tasks
  .post(createTask);  // POST   /api/tasks

router.get('/stats', getTaskStats); // GET /api/tasks/stats

router.route('/:id')
  .put(updateTask)    // PUT    /api/tasks/:id
  .delete(deleteTask); // DELETE /api/tasks/:id

export default router;