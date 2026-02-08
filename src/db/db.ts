import Dexie from 'dexie';
import type { Table } from 'dexie';

export interface Subtask {
    id: string;
    title: string;
    isCompleted: boolean;
    dueDate?: Date;
}

export interface Task {
    id?: number;
    title: string;
    description?: string;
    isCompleted: boolean;
    dueDate?: Date;
    priority: 'low' | 'medium' | 'high';
    listId?: number;
    tags?: string[];
    order?: number; // Added order field
    subtasks?: Subtask[]; // Added subtasks
    isDeleted?: boolean; // Added isDeleted field
    createdAt: Date;
    updatedAt: Date;
}

export interface TaskList {
    id?: number;
    name: string;
    color?: string;
    icon?: string;
    isDefault?: boolean;
}

export interface Tag {
    id?: number;
    name: string;
    color?: string;
}

export class TaskManagerDB extends Dexie {
    tasks!: Table<Task>;
    lists!: Table<TaskList>;
    tags!: Table<Tag>;

    constructor() {
        super('TaskManagerDB');

        // Schema definition
        this.version(1).stores({
            tasks: '++id, title, isCompleted, dueDate, priority, listId, *tags, createdAt',
            lists: '++id, name',
            tags: '++id, name'
        });

        // Version 2: Add order index
        this.version(2).stores({
            tasks: '++id, title, isCompleted, dueDate, priority, listId, *tags, order, createdAt'
        });

        // Version 3: Add isDeleted index
        this.version(3).stores({
            tasks: '++id, title, isCompleted, dueDate, priority, listId, *tags, order, isDeleted, createdAt'
        });
    }
}

export const db = new TaskManagerDB();

// Populate default data if empty
db.on('populate', () => {
    db.lists.bulkAdd([
        { name: 'Inbox', isDefault: true, icon: 'inbox', color: '#6366f1' },
        { name: 'Personal', icon: 'user', color: '#ec4899' },
        { name: 'Work', icon: 'briefcase', color: '#8b5cf6' }
    ]);
});
