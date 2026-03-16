import { useState, useMemo, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { AlertCircle } from 'lucide-react';
import type { Task, TaskStatus, TaskPriority } from '../types';
import { COLUMNS } from '../types';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { FilterBar } from './FilterBar';
import { BoardStats } from './BoardStats';
import { TeamManager } from './TeamManager';
import { LabelManager } from './LabelManager';
import { useTasks } from '../hooks/useTasks';
import { useTeamMembers } from '../hooks/useTeamMembers';
import { useLabels } from '../hooks/useLabels';

const COLUMN_IDS: TaskStatus[] = ['todo', 'in_progress', 'in_review', 'done'];

interface BoardProps {
  userId: string;
}

export function Board({ userId }: BoardProps) {
  const { tasks, loading, error, createTask, updateTask, moveTask, deleteTask, refetch } = useTasks(userId);
  const { members, addMember, removeMember } = useTeamMembers(userId);
  const { labels, addLabel, removeLabel } = useLabels(userId);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');
  const [teamManagerOpen, setTeamManagerOpen] = useState(false);
  const [labelManagerOpen, setLabelManagerOpen] = useState(false);

  // Local override of task statuses during drag (for live preview)
  const [localOverrides, setLocalOverrides] = useState<Record<string, TaskStatus>>({});

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | null>(null);
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);
  const [labelFilter, setLabelFilter] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (priorityFilter && task.priority !== priorityFilter) return false;
      if (assigneeFilter && !task.assignees?.some(a => a.id === assigneeFilter)) return false;
      if (labelFilter && !task.labels?.some(l => l.id === labelFilter)) return false;
      return true;
    });
  }, [tasks, searchQuery, priorityFilter, assigneeFilter, labelFilter]);

  // Apply local overrides for live drag preview
  const displayTasks = useMemo(() => {
    return filteredTasks.map(task => {
      if (localOverrides[task.id]) {
        return { ...task, status: localOverrides[task.id] };
      }
      return task;
    });
  }, [filteredTasks, localOverrides]);

  const tasksByColumn = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      todo: [], in_progress: [], in_review: [], done: [],
    };
    displayTasks.forEach(task => {
      grouped[task.status]?.push(task);
    });
    Object.values(grouped).forEach(arr => arr.sort((a, b) => a.position - b.position));
    return grouped;
  }, [displayTasks]);

  // Find which column an id belongs to (could be a column id or a task id)
  const findColumn = useCallback((id: string): TaskStatus | null => {
    if (COLUMN_IDS.includes(id as TaskStatus)) return id as TaskStatus;
    // Check overrides first
    if (localOverrides[id]) return localOverrides[id];
    const task = tasks.find(t => t.id === id);
    return task ? task.status : null;
  }, [tasks, localOverrides]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);

    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    // Task is being dragged to a different column — update local override
    setLocalOverrides(prev => ({ ...prev, [activeId]: overColumn }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    setLocalOverrides({});

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Determine target column
    let targetStatus: TaskStatus;
    if (COLUMN_IDS.includes(overId as TaskStatus)) {
      targetStatus = overId as TaskStatus;
    } else {
      // Dropped on another task — find that task's column
      // Check if we had a local override (from dragOver)
      const overTask = tasks.find(t => t.id === overId);
      if (overTask) {
        // Use the override if it existed, otherwise the task's actual status
        targetStatus = localOverrides[overId] || overTask.status;
      } else {
        return;
      }
    }

    const targetTasks = tasks
      .filter(t => t.status === targetStatus && t.id !== taskId)
      .sort((a, b) => a.position - b.position);

    let newPosition: number;
    const overTask = tasks.find(t => t.id === overId);
    if (overTask && overTask.id !== taskId) {
      const overIndex = targetTasks.findIndex(t => t.id === overTask.id);
      newPosition = overIndex >= 0 ? overIndex : targetTasks.length;
    } else {
      newPosition = targetTasks.length;
    }

    moveTask(taskId, targetStatus, newPosition);
  };

  const openCreateModal = (status: TaskStatus) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setDefaultStatus(task.status);
    setModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        onOpenTeamManager={() => setTeamManagerOpen(true)}
        onOpenLabelManager={() => setLabelManagerOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <div className="flex-1 overflow-auto">
          <div style={{ padding: '32px 40px' }}>
            {error && (
              <div style={{ marginBottom: 24 }} className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div style={{ marginBottom: 28 }}>
              <BoardStats tasks={tasks} />
            </div>

            <div style={{ marginBottom: 28 }}>
              <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                priorityFilter={priorityFilter}
                onPriorityChange={setPriorityFilter}
                assigneeFilter={assigneeFilter}
                onAssigneeChange={setAssigneeFilter}
                labelFilter={labelFilter}
                onLabelChange={setLabelFilter}
                teamMembers={members}
                labels={labels}
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center" style={{ paddingTop: 80, paddingBottom: 80 }}>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-slate-200 border-t-teal-500 rounded-full animate-spin" />
                  <p className="text-slate-400 text-[13px]">Loading tasks...</p>
                </div>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={rectIntersection}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                <div className="flex" style={{ gap: 20 }}>
                  {COLUMNS.map(column => (
                    <Column
                      key={column.id}
                      column={column}
                      tasks={tasksByColumn[column.id]}
                      onAddTask={() => openCreateModal(column.id)}
                      onTaskClick={openEditModal}
                    />
                  ))}
                </div>

                <DragOverlay dropAnimation={null}>
                  {activeTask && (
                    <div style={{ width: 260, opacity: 0.9, transform: 'rotate(2deg)' }}>
                      <TaskCard task={activeTask} onClick={() => {}} />
                    </div>
                  )}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSubmit={data => {
          if (editingTask) {
            updateTask(editingTask.id, {
              title: data.title,
              description: data.description || null,
              status: data.status,
              priority: data.priority,
              due_date: data.due_date,
            }, data.assignee_ids, data.label_ids);
          } else {
            createTask(data);
          }
        }}
        onDelete={editingTask ? () => deleteTask(editingTask.id) : undefined}
        task={editingTask}
        defaultStatus={defaultStatus}
        teamMembers={members}
        labels={labels}
      />

      <TeamManager
        isOpen={teamManagerOpen}
        onClose={() => setTeamManagerOpen(false)}
        members={members}
        onAdd={addMember}
        onRemove={removeMember}
      />

      <LabelManager
        isOpen={labelManagerOpen}
        onClose={() => setLabelManagerOpen(false)}
        labels={labels}
        onAdd={addLabel}
        onRemove={removeLabel}
      />
    </div>
  );
}
