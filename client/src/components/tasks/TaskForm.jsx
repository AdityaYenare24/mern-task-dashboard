import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask, updateTask, fetchTaskStats } from '../../features/tasks/taskSlice';

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
};

const TaskForm = ({ task = null, onClose }) => {
  const dispatch = useDispatch();
  const isEditing = !!task;

  const [form, setForm] = useState(
    isEditing
      ? { ...task, dueDate: task.dueDate ? task.dueDate.split('T')[0] : '' }
      : EMPTY_FORM
  );
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }

    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await dispatch(updateTask({ id: task._id, updates: form })).unwrap();
      } else {
        await dispatch(createTask(form)).unwrap();
      }
      await dispatch(fetchTaskStats()); // Refresh stats cards
      onClose();
    } catch (err) {
      setError(err || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs text-[#6b7280] mb-1.5 uppercase tracking-wider">Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-xs text-[#6b7280] mb-1.5 uppercase tracking-wider">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add some details..."
          rows={3}
          className="input-field resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#6b7280] mb-1.5 uppercase tracking-wider">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="input-field">
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-[#6b7280] mb-1.5 uppercase tracking-wider">Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#6b7280] mb-1.5 uppercase tracking-wider">Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
        </button>
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;