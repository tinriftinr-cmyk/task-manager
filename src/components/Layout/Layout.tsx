import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Menu } from 'lucide-react';
import './Layout.css';
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useTasks } from '../../hooks/useTasks';

export const Layout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { tasks, updateTask, reorderTasks } = useTasks();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const overId = String(over.id);
        const taskId = Number(active.id);

        if (overId.startsWith('tag-')) {
            const listId = Number(overId.replace('tag-', ''));
            updateTask(taskId, { listId });
        } else if (overId === 'smart-inbox') {
            updateTask(taskId, { listId: 1 });
        } else if (overId === 'smart-today') {
            updateTask(taskId, { dueDate: new Date() });
        } else if (typeof over.id === 'number' && tasks) {
            // Reordering tasks
            const activeId = Number(active.id);
            const overTargetId = Number(over.id);

            if (activeId !== overTargetId) {
                const oldIndex = tasks.findIndex((t) => t.id === activeId);
                const newIndex = tasks.findIndex((t) => t.id === overTargetId);

                if (oldIndex !== -1 && newIndex !== -1) {
                    const newOrdered = arrayMove(tasks, oldIndex, newIndex);
                    reorderTasks(newOrdered);
                }
            }
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="layout">
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

                {isSidebarOpen && (
                    <div className="sidebar-overlay" onClick={closeSidebar} />
                )}

                <main className="main-content">
                    <header className="mobile-header">
                        <button className="menu-btn" onClick={toggleSidebar} aria-label="Open menu">
                            <Menu size={24} />
                        </button>
                        <span className="mobile-logo">TaskFlow</span>
                    </header>

                    <div className="desktop-top-bar">
                        <TopBar />
                    </div>

                    <div className="content-container">
                        <Outlet />
                    </div>
                </main>
            </div>
        </DndContext>
    );
};
