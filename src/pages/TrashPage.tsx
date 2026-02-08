import React from 'react';
import { useTasks } from '../hooks/useTasks';
import { Trash2, RotateCcw, Trash } from 'lucide-react';
import './TrashPage.css';

export const TrashPage: React.FC = () => {
    const { tasks, hardDeleteTask, restoreTask } = useTasks();

    if (!tasks) return <div>読み込み中...</div>;

    const deletedTasks = tasks.filter(t => t.isDeleted);

    return (
        <div className="page-content">
            <header className="page-header">
                <h1>ゴミ箱</h1>
                <p className="subtitle">削除されたタスクはここで復元または完全に削除できます</p>
            </header>

            <div className="task-container">
                {deletedTasks.length === 0 ? (
                    <div className="empty-state">
                        <Trash2 size={48} />
                        <p>ゴミ箱は空です</p>
                    </div>
                ) : (
                    <div className="trash-list">
                        {deletedTasks.map(task => (
                            <div key={task.id} className="trash-item glass-panel">
                                <div className="trash-info">
                                    <span className="task-title">{task.title}</span>
                                    <p className="task-meta">削除日: {task.updatedAt.toLocaleDateString()}</p>
                                </div>
                                <div className="trash-actions">
                                    <button
                                        className="restore-btn"
                                        onClick={() => restoreTask(task.id!)}
                                        title="復元"
                                    >
                                        <RotateCcw size={18} />
                                    </button>
                                    <button
                                        className="delete-forever-btn"
                                        onClick={() => {
                                            if (confirm('このタスクを完全に削除しますか？')) {
                                                hardDeleteTask(task.id!);
                                            }
                                        }}
                                        title="完全に削除"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
