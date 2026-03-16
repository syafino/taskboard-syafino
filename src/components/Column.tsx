import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import type { Task, Column as ColumnType } from '../types';
import { TaskCard } from './TaskCard';
import { EmptyState } from './EmptyState';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onAddTask: () => void;
  onTaskClick: (task: Task) => void;
}

export function Column({ column, tasks, onAddTask, onTaskClick }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex flex-col flex-1 min-w-[260px]">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }} />
          <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">{column.title}</h3>
          <span className="text-[11px] font-medium text-slate-400">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddTask}
          className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white hover:shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Droppable area */}
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-xl p-2 space-y-2 min-h-[300px] transition-all duration-200 ${
          isOver
            ? 'bg-teal-50/60 ring-2 ring-teal-300/50'
            : 'bg-slate-50/80'
        }`}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <EmptyState onAddTask={onAddTask} />
          ) : (
            tasks.map(task => (
              <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
