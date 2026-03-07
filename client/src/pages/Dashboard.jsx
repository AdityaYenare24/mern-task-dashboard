import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, fetchTaskStats } from '../features/tasks/taskSlice';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/ui/Modal';

const FILTERS = ['all', 'todo', 'in-progress', 'completed'];
const PRIORITIES = ['all', 'low', 'medium', 'high'];
const SORT_OPTIONS = [
  { value: 'newest',   label: 'Newest First' },
  { value: 'oldest',   label: 'Oldest First' },
  { value: 'due-date', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
];

const PRIORITY_ORDER = { high: 3, medium: 2, low: 1 };

const StatCard = ({ label, count, color, icon }) => (
  <div className="card border-[#2a2f3d] hover:border-amber-500/20 transition-all duration-200">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne' }}>{count}</p>
        <p className="text-xs text-[#6b7280] font-mono">{label}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items, stats } = useSelector((state) => state.tasks);

  const [activeFilter,   setActiveFilter]   = useState('all');
  const [activePriority, setActivePriority] = useState('all');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [sortBy,         setSortBy]         = useState('newest');
  const [createOpen,     setCreateOpen]     = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchTaskStats());
  }, [dispatch]);

  // ── Search + Filter + Sort (all computed in memory, no extra API calls) ──────
  const filteredAndSorted = useMemo(() => {
    let result = [...items];

    // 1. Search — matches title or description
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    // 2. Status filter
    if (activeFilter !== 'all') {
      result = result.filter((t) => t.status === activeFilter);
    }

    // 3. Priority filter
    if (activePriority !== 'all') {
      result = result.filter((t) => t.priority === activePriority);
    }

    // 4. Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'due-date':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          return (PRIORITY_ORDER[b.priority] || 0) - (PRIORITY_ORDER[a.priority] || 0);
        default: // newest
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return result;
  }, [items, searchQuery, activeFilter, activePriority, sortBy]);

  const hasActiveFilters = searchQuery || activeFilter !== 'all' ||
                           activePriority !== 'all' || sortBy !== 'newest';

  const clearAllFilters = () => {
    setSearchQuery('');
    setActiveFilter('all');
    setActivePriority('all');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen page-enter">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne' }}>
              Good {getGreeting()},{' '}
              <span className="text-amber-400">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-sm text-[#6b7280] mt-1 font-mono">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric',
              })}
            </p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> New Task
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard label="Total"       count={items.length}              icon="▦" color="bg-slate-500/20 text-slate-400" />
          <StatCard label="Todo"        count={stats.todo || 0}           icon="○" color="bg-slate-500/20 text-slate-400" />
          <StatCard label="In Progress" count={stats['in-progress'] || 0} icon="◑" color="bg-blue-500/20 text-blue-400" />
          <StatCard label="Completed"   count={stats.completed || 0}      icon="●" color="bg-emerald-500/20 text-emerald-400" />
        </div>

        {/* ── Search Bar ───────────────────────────────────────────────────── */}
        <div className="relative mb-4">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm">
            ⌕
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title or description..."
            className="input-field pl-9 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280]
                         hover:text-white transition-colors text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>

        {/* ── Filter + Sort Row ────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mb-5">

          {/* Status filters */}
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all
                  ${activeFilter === f
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'bg-[#1a1e2a] text-[#6b7280] hover:text-white border border-[#2a2f3d]'
                  }`}
              >
                {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-[#2a2f3d] hidden sm:block" />

          {/* Priority filters */}
          <div className="flex gap-1.5 flex-wrap">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                onClick={() => setActivePriority(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all
                  ${activePriority === p
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-[#1a1e2a] text-[#6b7280] hover:text-white border border-[#2a2f3d]'
                  }`}
              >
                {p === 'all' ? 'All Priority' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-auto text-xs py-1.5 px-3 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-400 hover:text-red-300 font-mono
                         border border-red-500/20 px-3 py-1.5 rounded-lg
                         hover:bg-red-500/10 transition-all"
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-[#6b7280] font-mono">
            Showing{' '}
            <span className="text-amber-400">{filteredAndSorted.length}</span>
            {' '}of{' '}
            <span className="text-white">{items.length}</span>
            {' '}tasks
            {searchQuery && (
              <span className="text-[#6b7280]"> for "<span className="text-white">{searchQuery}</span>"</span>
            )}
          </p>
        </div>

        {/* Task grid — pass pre-filtered items directly */}
        <TaskList items={filteredAndSorted} />
      </main>

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="New Task">
        <TaskForm onClose={() => setCreateOpen(false)} />
      </Modal>
    </div>
  );
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
};

export default Dashboard;