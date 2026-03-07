import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask, fetchTaskStats } from '../../features/tasks/taskSlice';
import Modal from '../ui/Modal';
import TaskForm from './TaskForm';

const STATUS_BADGE = {
  'todo':        'badge-todo',
  'in-progress': 'badge-in-progress',
  'completed':   'badge-completed',
};
const PRIORITY_BADGE = {
  low: 'badge-low', medium: 'badge-medium', high: 'badge-high',
};

const TaskCard = ({ task }) => {
  const dispatch = useDispatch();
  const [editOpen, setEditOpen]       = useState(false);
  const [deleting, setDeleting]       = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setDeleting(true);
    await dispatch(deleteTask(task._id));
    await dispatch(fetchTaskStats());
  };

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <>
      <div className="card border-[#2a2f3d] hover:border-amber-500/40 transition-all duration-200
                      group hover:shadow-lg hover:shadow-amber-500/5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-[#e8eaf0] text-sm leading-snug
                         group-hover:text-white transition-colors line-clamp-2"
              style={{ fontFamily: 'Syne, sans-serif' }}>
            {task.title}
          </h3>
          {/* Action buttons — visible on hover */}
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => setEditOpen(true)}
              className="p-1.5 rounded-md text-[#6b7280] hover:text-amber-400
                         hover:bg-amber-500/10 transition-all text-xs"
              title="Edit"
            >
              ✎
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 rounded-md text-[#6b7280] hover:text-red-400
                         hover:bg-red-500/10 transition-all text-xs"
              title="Delete"
            >
              {deleting ? '…' : '✕'}
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-[#6b7280] mb-3 leading-relaxed line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1f2330]">
          <div className="flex items-center gap-2">
            <span className={STATUS_BADGE[task.status]}>
              {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </span>
            <span className={PRIORITY_BADGE[task.priority]}>
              {task.priority}
            </span>
          </div>

          {formattedDate && (
            <span className={`text-xs font-mono ${isOverdue ? 'text-red-400' : 'text-[#6b7280]'}`}>
              {isOverdue ? '⚠ ' : '◷ '}{formattedDate}
            </span>
          )}
        </div>
      </div>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Task">
        <TaskForm task={task} onClose={() => setEditOpen(false)} />
      </Modal>
    </>
  );
};

export default TaskCard;