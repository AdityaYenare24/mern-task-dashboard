import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { updateTask } from '../../features/tasks/taskSlice';
import TaskCard from './TaskCard';
import Spinner from '../ui/Spinner';

const COLUMNS = [
  { id: 'todo',        label: 'Todo',        color: 'border-slate-500/40' },
  { id: 'in-progress', label: 'In Progress', color: 'border-blue-500/40'  },
  { id: 'completed',   label: 'Completed',   color: 'border-emerald-500/40' },
];

const TaskList = ({ items }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.tasks);

  // Group tasks by status for the Kanban columns
  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = (items || []).filter((t) => t.status === col.id);
    return acc;
  }, {});

  // Called when a card is dropped in a new column
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside any column
    if (!destination) return;

    // Dropped in same position
    if (destination.droppableId === source.droppableId &&
        destination.index === source.index) return;

    // If moved to a different column — update the task status
    if (destination.droppableId !== source.droppableId) {
      dispatch(updateTask({
        id: draggableId,
        updates: { status: destination.droppableId },
      }));
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  );

  if (error) return (
    <div className="text-center py-20 text-red-400 text-sm">{error}</div>
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <div key={col.id} className={`rounded-xl border ${col.color} bg-[#0f1118] p-3`}>

            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]"
                  style={{ fontFamily: 'Syne' }}>
                {col.label}
              </h3>
              <span className="text-xs font-mono bg-[#1a1e2a] text-[#6b7280]
                               px-2 py-0.5 rounded-full border border-[#2a2f3d]">
                {grouped[col.id].length}
              </span>
            </div>

            {/* Droppable zone */}
            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[200px] rounded-lg transition-all duration-200 space-y-3
                    ${snapshot.isDraggingOver
                      ? 'bg-amber-500/5 border border-dashed border-amber-500/30'
                      : 'border border-transparent'
                    }`}
                >
                  {grouped[col.id].length === 0 && !snapshot.isDraggingOver && (
                    <div className="flex items-center justify-center h-24 text-[#4b5563] text-xs font-mono">
                      Drop tasks here
                    </div>
                  )}

                  {grouped[col.id].map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`transition-all duration-150
                            ${snapshot.isDragging
                              ? 'rotate-1 scale-105 shadow-2xl shadow-amber-500/20 opacity-90'
                              : ''
                            }`}
                        >
                          <TaskCard task={task} isDragging={snapshot.isDragging} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskList;