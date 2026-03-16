import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Task, TaskStatus, TaskPriority } from '../types';

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('position', { ascending: true });

    if (tasksError) {
      setError(tasksError.message);
      setLoading(false);
      return;
    }

    // Fetch assignees
    const taskIds = tasksData.map((t: Task) => t.id);
    let assigneeMap: Record<string, string[]> = {};
    let memberMap: Record<string, { id: string; name: string; color: string }> = {};

    if (taskIds.length > 0) {
      const { data: assignees } = await supabase
        .from('task_assignees')
        .select('task_id, member_id')
        .in('task_id', taskIds);

      if (assignees) {
        const memberIds = [...new Set(assignees.map(a => a.member_id))];
        if (memberIds.length > 0) {
          const { data: members } = await supabase
            .from('team_members')
            .select('id, name, color')
            .in('id', memberIds);
          if (members) {
            members.forEach(m => { memberMap[m.id] = m; });
          }
        }
        assignees.forEach(a => {
          if (!assigneeMap[a.task_id]) assigneeMap[a.task_id] = [];
          assigneeMap[a.task_id].push(a.member_id);
        });
      }

      // Fetch labels
      const { data: taskLabels } = await supabase
        .from('task_labels')
        .select('task_id, label_id')
        .in('task_id', taskIds);

      let labelMap: Record<string, string[]> = {};
      let labelDataMap: Record<string, { id: string; name: string; color: string }> = {};

      if (taskLabels) {
        const labelIds = [...new Set(taskLabels.map(tl => tl.label_id))];
        if (labelIds.length > 0) {
          const { data: labels } = await supabase
            .from('labels')
            .select('id, name, color')
            .in('id', labelIds);
          if (labels) {
            labels.forEach(l => { labelDataMap[l.id] = l; });
          }
        }
        taskLabels.forEach(tl => {
          if (!labelMap[tl.task_id]) labelMap[tl.task_id] = [];
          labelMap[tl.task_id].push(tl.label_id);
        });
      }

      const enrichedTasks = tasksData.map((task: Task) => ({
        ...task,
        assignees: (assigneeMap[task.id] || [])
          .map(mid => memberMap[mid])
          .filter(Boolean) as Task['assignees'],
        labels: (labelMap[task.id] || [])
          .map(lid => labelDataMap[lid])
          .filter(Boolean) as Task['labels'],
      }));

      setTasks(enrichedTasks);
    } else {
      setTasks([]);
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (data: {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    due_date?: string | null;
    assignee_ids?: string[];
    label_ids?: string[];
  }) => {
    if (!userId) return;

    const maxPos = tasks
      .filter(t => t.status === data.status)
      .reduce((max, t) => Math.max(max, t.position), -1);

    const { data: newTask, error } = await supabase
      .from('tasks')
      .insert({
        title: data.title,
        description: data.description || null,
        status: data.status,
        priority: data.priority,
        due_date: data.due_date || null,
        position: maxPos + 1,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
      return;
    }

    if (data.assignee_ids && data.assignee_ids.length > 0) {
      await supabase.from('task_assignees').insert(
        data.assignee_ids.map(mid => ({ task_id: newTask.id, member_id: mid }))
      );
    }

    if (data.label_ids && data.label_ids.length > 0) {
      await supabase.from('task_labels').insert(
        data.label_ids.map(lid => ({ task_id: newTask.id, label_id: lid }))
      );
    }

    await fetchTasks();
  };

  const updateTask = async (
    taskId: string,
    updates: Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'due_date' | 'position'>>,
    assignee_ids?: string[],
    label_ids?: string[]
  ) => {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId);

    if (error) {
      setError(error.message);
      return;
    }

    if (assignee_ids !== undefined) {
      await supabase.from('task_assignees').delete().eq('task_id', taskId);
      if (assignee_ids.length > 0) {
        await supabase.from('task_assignees').insert(
          assignee_ids.map(mid => ({ task_id: taskId, member_id: mid }))
        );
      }
    }

    if (label_ids !== undefined) {
      await supabase.from('task_labels').delete().eq('task_id', taskId);
      if (label_ids.length > 0) {
        await supabase.from('task_labels').insert(
          label_ids.map(lid => ({ task_id: taskId, label_id: lid }))
        );
      }
    }

    await fetchTasks();
  };

  const moveTask = async (taskId: string, newStatus: TaskStatus, newPosition: number) => {
    // Optimistic update
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: newStatus, position: newPosition } : t
    ));

    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus, position: newPosition })
      .eq('id', taskId);

    if (error) {
      setError(error.message);
      await fetchTasks();
    }
  };

  const deleteTask = async (taskId: string) => {
    await supabase.from('task_assignees').delete().eq('task_id', taskId);
    await supabase.from('task_labels').delete().eq('task_id', taskId);
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) {
      setError(error.message);
      return;
    }
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  return { tasks, loading, error, createTask, updateTask, moveTask, deleteTask, refetch: fetchTasks };
}
