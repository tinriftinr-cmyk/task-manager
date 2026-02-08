import React from 'react';
import type { Task } from '../../db/db';
import { SortableTaskItem } from './SortableTaskItem';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import './Task.css';

interface TaskListProps {
    tasks: Task[];
    onToggle: (id: number, isCompleted: boolean) => void;
    onDelete: (id: number) => void;
    onReorder?: (newOrder: Task[]) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete }) => {

    if (tasks.length === 0) {
        return (
            <div className="empty-state">
                <p>タスクがありません。上の入力欄から追加してみましょう！</p>
            </div>
        );
    }

    // Filter out tasks without ID for sortable context (shouldn't happen for persisted tasks)
    const taskIds = tasks.map(t => t.id!).filter(Boolean);

    return (
        <SortableContext
            items={taskIds}
            strategy={verticalListSortingStrategy}
        >
            <div className="task-list">
                {tasks.map(task => (
                    <SortableTaskItem
                        key={task.id}
                        task={task}
                        onToggle={onToggle}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </SortableContext>
    );
};
