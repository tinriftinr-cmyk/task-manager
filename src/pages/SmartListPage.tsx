import React from 'react';
import { useTasks } from '../hooks/useTasks';
import { TaskList } from '../components/Task/TaskList';
import { TaskEditor } from '../components/Task/TaskEditor';
import { isSameDay, isAfter, isBefore, startOfDay } from 'date-fns';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import './Inbox.css';

interface SmartListPageProps {
    title: string;
    filterType: 'today' | 'upcoming' | 'overdue' | 'inbox' | 'tag';
    tagFilter?: string;
}

export const SmartListPage: React.FC<SmartListPageProps> = ({ title, filterType, tagFilter }) => {
    const { tasks, addTask, toggleTaskCompletion, deleteTask, reorderTasks } = useTasks();

    if (!tasks) return <div>読み込み中...</div>;

    const today = startOfDay(new Date());

    const filteredTasks = tasks.filter(task => {
        if (task.isDeleted) return false;

        const dueDate = task.dueDate ? startOfDay(new Date(task.dueDate)) : null;

        switch (filterType) {
            case 'today':
                return dueDate && isSameDay(dueDate, today);
            case 'upcoming':
                return dueDate && isAfter(dueDate, today);
            case 'overdue':
                return dueDate && isBefore(dueDate, today) && !task.isCompleted;
            case 'tag':
                return task.tags?.includes(tagFilter || '');
            case 'inbox':
                return !task.listId || task.listId === 1; // Default inbox
            default:
                return true;
        }
    });

    const incompleteTasks = filteredTasks.filter(t => !t.isCompleted);
    const completedTasks = filteredTasks.filter(t => t.isCompleted);

    return (
        <div className="page-content">
            <header className="page-header">
                <h1>{title}</h1>
                <p className="subtitle">
                    {filterType === 'today' ? format(new Date(), 'yyyy年 M月 d日 (eeee)', { locale: ja }) : `${filteredTasks.length} タスク`}
                </p>
            </header>

            <div className="task-container">
                {filterType !== 'overdue' && filterType !== 'upcoming' && (
                    <TaskEditor onAdd={(title, listId, dueDate) => addTask({
                        title,
                        isCompleted: false,
                        priority: 'medium',
                        listId,
                        dueDate: filterType === 'today' ? new Date() : dueDate
                    })} />
                )}

                <div className="section-title">タスク <span>{incompleteTasks.length}</span></div>
                <TaskList
                    tasks={incompleteTasks}
                    onToggle={toggleTaskCompletion}
                    onDelete={deleteTask}
                    onReorder={reorderTasks}
                />

                {completedTasks.length > 0 && (
                    <>
                        <div className="section-title mt-8">完了済み <span>{completedTasks.length}</span></div>
                        <div className="completed-list">
                            <TaskList
                                tasks={completedTasks}
                                onToggle={toggleTaskCompletion}
                                onDelete={deleteTask}
                                onReorder={reorderTasks}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
