import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useTasks } from '../hooks/useTasks';
import { useLists } from '../hooks/useLists';
import { TaskList } from '../components/Task/TaskList';
import { TaskEditor } from '../components/Task/TaskEditor';
import type { TaskList as ITaskList } from '../db/db';
import './Inbox.css'; // Reuse inbox styles for now

export const ProjectPage: React.FC = () => {
    const { tagId } = useParams<{ tagId: string }>();
    const listId = Number(tagId);
    const { tasks, addTask, toggleTaskCompletion, deleteTask } = useTasks();
    const { lists } = useLists();
    const [currentList, setCurrentList] = useState<ITaskList | null>(null);

    useEffect(() => {
        if (lists && listId) {
            const list = lists.find(l => l.id === listId);
            setCurrentList(list || null);
        }
    }, [lists, listId]);

    if (!tasks || !lists) return <div>読み込み中...</div>;

    if (!currentList) {
        return (
            <div className="page-content">
                <h1>タグが見つかりません</h1>
            </div>
        );
    }

    const projectTasks = tasks.filter(t => t.listId === listId && !t.isDeleted);
    const incompleteTasks = projectTasks.filter(t => !t.isCompleted);
    const completedTasks = projectTasks.filter(t => t.isCompleted);

    return (
        <div className="page-content">
            <header className="page-header">
                <h1 style={{ color: currentList.color }}>{currentList.name}</h1>
                <p className="subtitle">{format(new Date(), 'yyyy年 M月 d日', { locale: ja })} · {projectTasks.length} タスク</p>
            </header>

            <div className="task-container">
                <TaskEditor
                    defaultListId={listId}
                    onAdd={(title, listId, dueDate) => addTask({
                        title,
                        isCompleted: false,
                        priority: 'medium',
                        listId,
                        dueDate
                    })}
                />

                <div className="section-title">タスク <span>{incompleteTasks.length}</span></div>
                <TaskList
                    tasks={incompleteTasks}
                    onToggle={toggleTaskCompletion}
                    onDelete={deleteTask}
                />

                {completedTasks.length > 0 && (
                    <>
                        <div className="section-title mt-8">完了済み <span>{completedTasks.length}</span></div>
                        <div className="completed-list">
                            <TaskList
                                tasks={completedTasks}
                                onToggle={toggleTaskCompletion}
                                onDelete={deleteTask}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
