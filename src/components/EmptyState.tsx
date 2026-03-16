import { Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddTask: () => void;
}

export function EmptyState({ onAddTask }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      <div className="w-10 h-10 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center mb-3">
        <Plus className="w-4 h-4 text-slate-300" />
      </div>
      <p className="text-slate-400 text-[13px] mb-1">No tasks yet</p>
      <button
        onClick={onAddTask}
        className="text-teal-600 text-[13px] font-medium hover:text-teal-700 transition-colors"
      >
        Create one
      </button>
    </div>
  );
}
