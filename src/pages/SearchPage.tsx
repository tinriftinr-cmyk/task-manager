import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { TaskList } from '../components/Task/TaskList';
import './Inbox.css'; // Reuse inbox styles

export const SearchPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { tasks, toggleTaskCompletion, deleteTask, reorderTasks } = useTasks();

    if (!tasks) return <div>Loading...</div>;

    const filteredTasks = tasks.filter(t =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(query.toLowerCase()))
    );

    const incompleteTasks = filteredTasks.filter(t => !t.isCompleted);
    const completedTasks = filteredTasks.filter(t => t.isCompleted);

    return (
        <div className="page-content">
            <header className="page-header">
                <h1>検索結果</h1>
                <p className="subtitle">"{query}" の検索結果: {filteredTasks.length} 件</p>
            </header>

            <div className="task-container">
                {/* Only show editor if query is not empty, usually we don't add tasks from search 
            unless we want to precheck 'title' with query. Optional. */}

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
