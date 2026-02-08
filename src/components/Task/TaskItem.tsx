import React, { useState, useRef } from 'react';
import type { Task, Subtask } from '../../db/db';
import { Circle, CheckCircle, Trash2, Calendar, Hash, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { useTasks } from '../../hooks/useTasks';
import { useLists } from '../../hooks/useLists';
import './Task.css';

interface TaskItemProps {
    task: Task;
    onToggle: (id: number, isCompleted: boolean) => void;
    onDelete: (id: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const [isComposing, setIsComposing] = useState(false);
    const { updateTask } = useTasks();
    const { lists } = useLists();
    const detailDateRef = useRef<HTMLInputElement>(null);

    const handleAddSubtask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isComposing) return;
        if (!newSubtaskTitle.trim() || !task.id) return;

        const newSubtask: Subtask = {
            id: crypto.randomUUID(),
            title: newSubtaskTitle.trim(),
            isCompleted: false
        };

        const updatedSubtasks = [...(task.subtasks || []), newSubtask];
        await updateTask(task.id, { subtasks: updatedSubtasks });
        setNewSubtaskTitle('');
    };

    const toggleSubtask = async (subtaskId: string) => {
        if (!task.id) return;
        const updatedSubtasks = (task.subtasks || []).map(st =>
            st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st
        );
        await updateTask(task.id, { subtasks: updatedSubtasks });
    };

    const deleteSubtask = async (subtaskId: string) => {
        if (!task.id) return;
        const updatedSubtasks = (task.subtasks || []).filter(st => st.id !== subtaskId);
        await updateTask(task.id, { subtasks: updatedSubtasks });
    };

    const updateSubtaskDate = async (subtaskId: string, date?: Date) => {
        if (!task.id) return;
        const updatedSubtasks = (task.subtasks || []).map(st =>
            st.id === subtaskId ? { ...st, dueDate: date } : st
        );
        await updateTask(task.id, { subtasks: updatedSubtasks });
    };

    const completedSubtasks = (task.subtasks || []).filter(st => st.isCompleted).length;
    const totalSubtasks = (task.subtasks || []).length;
    const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

    return (
        <div className={clsx('task-item-wrapper', { expanded: isExpanded })}>
            <div className={clsx('task-item', { completed: task.isCompleted })}>
                <button
                    className="task-checkbox"
                    onClick={() => onToggle(task.id!, !task.isCompleted)}
                    aria-label={task.isCompleted ? "完了済みから戻す" : "完了にする"}
                >
                    {task.isCompleted ? (
                        <CheckCircle className="icon-check completed" size={20} />
                    ) : (
                        <Circle className="icon-check" size={20} />
                    )}
                </button>

                <div className="task-content" onClick={() => setIsExpanded(!isExpanded)}>
                    <span className="task-title">{task.title}</span>
                    {task.description && <p className="task-description">{task.description}</p>}

                    <div className="task-meta">
                        {task.dueDate && (
                            <span className="task-date">
                                <Calendar size={14} />
                                {format(task.dueDate, 'M月d日')}
                            </span>
                        )}
                        {task.tags && task.tags.length > 0 && (
                            <div className="task-tags">
                                {task.tags.map((tag, index) => (
                                    <span key={index} className="task-tag">#{tag}</span>
                                ))}
                            </div>
                        )}
                        {totalSubtasks > 0 && (
                            <span className="subtask-count">
                                {completedSubtasks}/{totalSubtasks}
                            </span>
                        )}
                    </div>
                    {totalSubtasks > 0 && (
                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${progress}%` }} />
                        </div>
                    )}
                </div>

                <div className="task-actions">
                    <button className="action-btn" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                    <button
                        className="action-btn delete"
                        onClick={() => onDelete(task.id!)}
                        aria-label="タスクを削除"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="subtasks-container">
                    <ul className="subtasks-list">
                        {(task.subtasks || []).map(subtask => (
                            <li key={subtask.id} className="subtask-item">
                                <div className="subtask-main">
                                    <button
                                        className="subtask-checkbox"
                                        onClick={() => toggleSubtask(subtask.id)}
                                    >
                                        {subtask.isCompleted ? <CheckCircle size={16} className="completed" /> : <Circle size={16} />}
                                    </button>
                                    <span className={clsx('subtask-title', { completed: subtask.isCompleted })}>{subtask.title}</span>
                                    <input
                                        type="date"
                                        className="subtask-date-input"
                                        value={subtask.dueDate ? format(new Date(subtask.dueDate), 'yyyy-MM-dd') : ''}
                                        onChange={(e) => {
                                            const date = e.target.value ? new Date(e.target.value) : undefined;
                                            updateSubtaskDate(subtask.id, date);
                                        }}
                                    />
                                    <button className="subtask-delete" onClick={() => deleteSubtask(subtask.id)}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <form onSubmit={handleAddSubtask} className="add-subtask-form">
                        <Plus size={16} className="add-icon" />
                        <input
                            type="text"
                            placeholder="サブタスクを追加"
                            value={newSubtaskTitle}
                            onChange={(e) => setNewSubtaskTitle(e.target.value)}
                            onCompositionStart={() => setIsComposing(true)}
                            onCompositionEnd={() => setIsComposing(false)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !isComposing) {
                                    // Let the form handlesubmit do the work
                                }
                            }}
                            className="subtask-input"
                        />
                        <button type="submit" style={{ display: 'none' }}>追加</button>
                    </form>

                    <div className="task-detail-footer">
                        <div className="detail-row">
                            <label onClick={() => detailDateRef.current?.showPicker()} style={{ cursor: 'pointer' }}>
                                <Calendar size={14} /> 期限:
                            </label>
                            <input
                                type="date"
                                className="date-input"
                                ref={detailDateRef}
                                value={task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''}
                                onChange={(e) => {
                                    const date = e.target.value ? new Date(e.target.value) : undefined;
                                    updateTask(task.id!, { dueDate: date });
                                }}
                            />
                        </div>
                        <div className="detail-row">
                            <label><Hash size={14} /> タグ:</label>
                            <select
                                className="detail-select"
                                value={task.listId || 1}
                                onChange={(e) => updateTask(task.id!, { listId: Number(e.target.value) })}
                            >
                                {lists?.map(list => (
                                    <option key={list.id} value={list.id}>
                                        {list.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
