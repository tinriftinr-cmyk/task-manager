import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Inbox, Calendar, CalendarDays, Hash, Settings,
    Moon, Sun, CheckCircle, Menu, Plus, Trash2, AlertTriangle
} from 'lucide-react';
import { clsx } from 'clsx';
import { useLists } from '../../hooks/useLists';
import { useTheme } from '../../contexts/ThemeContext';
import { useDroppable } from '@dnd-kit/core';
import './Sidebar.css';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface DroppableNavItemProps {
    id: string;
    to: string;
    icon: React.ReactNode;
    label: string;
    end?: boolean;
    onDelete?: () => void;
}

const DroppableNavItem: React.FC<DroppableNavItemProps> = ({ id, to, icon, label, end, onDelete }) => {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className={clsx('droppable-nav-item', { 'is-over': isOver })}>
            <NavLink to={to} className={({ isActive }) => clsx('nav-item', { active: isActive })} end={end}>
                <div className="nav-item-content">
                    {icon}
                    <span>{label}</span>
                </div>
                {onDelete && (
                    <button
                        className="nav-action-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            onDelete();
                        }}
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </NavLink>
        </div>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { lists, addList, deleteList } = useLists();
    const { theme, toggleTheme } = useTheme();
    const [isAddingTag, setIsAddingTag] = React.useState(false);
    const [newTagName, setNewTagName] = React.useState('');

    const handleAddTag = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newTagName.trim()) {
            await addList({
                name: newTagName.trim(),
                icon: 'hash',
                color: '#6366f1'
            });
            setNewTagName('');
            setIsAddingTag(false);
        }
    };

    const handleDeleteTag = async (id: number, name: string) => {
        if (confirm(`タグ「${name}」を削除しますか？\nこのタグが付いたタスクはインボックスへ移動します。`)) {
            await deleteList(id);
        }
    };

    return (
        <aside className={clsx('sidebar', { 'open': isOpen })}>
            <div className="sidebar-header">
                <div className="logo">
                    <CheckCircle className="icon-logo" />
                    <span className="logo-text">TaskFlow</span>
                </div>
                <button className="close-btn" onClick={onClose} aria-label="Close sidebar">
                    <Menu size={20} />
                </button>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    <DroppableNavItem id="smart-inbox" to="/" icon={<Inbox size={20} />} label="インボックス" end />
                    <DroppableNavItem id="smart-today" to="/today" icon={<Calendar size={20} />} label="今日" />
                    <DroppableNavItem id="smart-upcoming" to="/upcoming" icon={<CalendarDays size={20} />} label="今後" />
                    <DroppableNavItem id="smart-overdue" to="/overdue" icon={<AlertTriangle size={20} />} label="期限切れ" />
                </div>

                <div className="nav-section">
                    <div className="section-header">
                        <span>タグ</span>
                        <button
                            className="add-project-btn"
                            aria-label="タグを追加"
                            onClick={() => setIsAddingTag(true)}
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    {isAddingTag && (
                        <form onSubmit={handleAddTag} className="add-project-form">
                            <input
                                type="text"
                                className="project-input"
                                placeholder="タグ名"
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                autoFocus
                                onBlur={() => !newTagName && setIsAddingTag(false)}
                            />
                        </form>
                    )}

                    <div className="project-list">
                        {lists?.filter(l => l.id !== 1).map(list => (
                            <DroppableNavItem
                                key={list.id}
                                id={`tag-${list.id}`}
                                to={`/tag/${list.id}`}
                                icon={<Hash size={18} style={{ color: list.color }} />}
                                label={list.name}
                                onDelete={() => handleDeleteTag(list.id!, list.name)}
                            />
                        ))}
                    </div>
                </div>
            </nav>

            <div className="sidebar-footer">
                <NavLink to="/trash" className={({ isActive }) => clsx('nav-item', { active: isActive })}>
                    <Trash2 size={20} />
                    <span>ゴミ箱</span>
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => clsx('nav-item', { active: isActive })}>
                    <Settings size={20} />
                    <span>設定</span>
                </NavLink>
                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    <span>{theme === 'dark' ? 'ライトモード' : 'ダークモード'}</span>
                </button>
            </div>
        </aside>
    );
};
