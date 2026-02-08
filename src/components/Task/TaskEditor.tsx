import React, { useState, useRef } from 'react';
import { Plus, Hash, Calendar } from 'lucide-react';
import { useLists } from '../../hooks/useLists';
import './Task.css';

interface TaskEditorProps {
    onAdd: (title: string, listId: number, dueDate?: Date) => void;
    defaultListId?: number;
}

export const TaskEditor: React.FC<TaskEditorProps> = ({ onAdd, defaultListId = 1 }) => {
    const [title, setTitle] = useState('');
    const [listId, setListId] = useState<number>(defaultListId);
    const [dueDate, setDueDate] = useState<string>('');
    const [isExpanded, setIsExpanded] = useState(false);
    const { lists } = useLists();
    const dateInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onAdd(title.trim(), listId, dueDate ? new Date(dueDate) : undefined);
            setTitle('');
            setDueDate('');
            // Reset listId to default if not in a specific tag page
            if (defaultListId === 1) setListId(1);
        }
    };

    return (
        <div className="task-editor">
            {!isExpanded ? (
                <button className="add-task-trigger" onClick={() => setIsExpanded(true)}>
                    <Plus size={20} />
                    <span>タスクを追加</span>
                </button>
            ) : (
                <form onSubmit={handleSubmit} className="task-form glass-panel">
                    <input
                        type="text"
                        className="task-input"
                        placeholder="何をする必要がありますか？"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />

                    <div className="task-options">
                        <div className="tag-input-container">
                            <Hash size={16} className="tag-icon" />
                            <select
                                className="tag-select"
                                value={listId}
                                onChange={(e) => setListId(Number(e.target.value))}
                            >
                                {lists?.map(list => (
                                    <option key={list.id} value={list.id}>
                                        {list.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="date-input-wrapper">
                            <Calendar
                                size={16}
                                className="date-icon"
                                onClick={() => dateInputRef.current?.showPicker()}
                                style={{ cursor: 'pointer' }}
                            />
                            <input
                                type="date"
                                className="date-input"
                                ref={dateInputRef}
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSubmit(e as any);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={() => setIsExpanded(false)}>
                            キャンセル
                        </button>
                        <button type="submit" className="btn-primary" disabled={!title.trim()}>
                            タスクを追加
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};
