import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { TaskList } from '../db/db';

export const useLists = () => {
    const lists = useLiveQuery(() => db.lists.toArray());

    const addList = async (list: Omit<TaskList, 'id'>) => {
        await db.lists.add(list);
    };

    const updateList = async (id: number, updates: Partial<TaskList>) => {
        await db.lists.update(id, updates);
    };

    const deleteList = async (id: number) => {
        // Optional: Delete associated tasks or move them to inbox
        await db.lists.delete(id);
    };

    return {
        lists,
        addList,
        updateList,
        deleteList
    };
};
