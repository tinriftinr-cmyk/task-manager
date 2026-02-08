import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { Task } from '../db/db';

export const useTasks = () => {
    const tasks = useLiveQuery(() => db.tasks.orderBy('order').toArray());

    const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
        const lastTask = await db.tasks.orderBy('order').last();
        const newOrder = lastTask && lastTask.order ? lastTask.order + 1000 : Date.now();

        await db.tasks.add({
            ...task,
            order: newOrder,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    };

    // We need a way to update multiple tasks orders
    const reorderTasks = async (newOrderedTasks: Task[]) => {
        await db.transaction('rw', db.tasks, async () => {
            for (let i = 0; i < newOrderedTasks.length; i++) {
                if (newOrderedTasks[i].id) {
                    await db.tasks.update(newOrderedTasks[i].id!, { order: i * 1000 });
                }
            }
        });
    };

    const updateTask = async (id: number, updates: Partial<Task>) => {
        await db.tasks.update(id, {
            ...updates,
            updatedAt: new Date()
        });
    };

    const deleteTask = async (id: number) => {
        await updateTask(id, { isDeleted: true });
    };

    const hardDeleteTask = async (id: number) => {
        await db.tasks.delete(id);
    };

    const restoreTask = async (id: number) => {
        await updateTask(id, { isDeleted: false });
    };

    const toggleTaskCompletion = async (id: number, isCompleted: boolean) => {
        await updateTask(id, { isCompleted });
    };

    return {
        tasks,
        addTask,
        updateTask,
        deleteTask,
        hardDeleteTask,
        restoreTask,
        toggleTaskCompletion,
        reorderTasks
    };
};
