import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useTasks } from '../hooks/useTasks';
import { TaskList } from '../components/Task/TaskList';
import { TaskEditor } from '../components/Task/TaskEditor';
import './Inbox.css';

export const Inbox: React.FC = () => {
    const { tasks, addTask, toggleTaskCompletion, deleteTask, reorderTasks } = useTasks();

    if (!tasks) return <div>Loading...</div>;

    // Sorting by order
    // Note: Dexie `orderBy` returns sorted array, but `tasks` is live query result. 
    // If we modify order, it updates.
    // However, we filter tasks later. We should ensure filtered lists are reordered correctly
    // or `reorderTasks` handles the global list reordering based on local change.
    // `reorderTasks` implementation updates ALL tasks' order based on index * 1000.
    // If we only pass a subset (incomplete tasks), we might mess up orders of completed tasks if we simply re-index from 0.
    // BUT `reorderTasks` takes `Task[]`. If we pass `incompleteTasks`, it updates their order.
    // The global order might overlap with completed tasks?
    // Ideally `order` should be global or per list.
    // If we view Inbox, we see specific tasks. Dragging them should reorder them RELATIVE to each other.
    // Dexie's `orderBy('order')` is global.
    // If we have tasks with order 1000, 2000, 3000.
    // If we swap 1000 and 2000, we get 2000, 1000? No, we update their order values.
    // We need to be careful.
    // For this MVP, let's assume we reorder within the viewed list.
    // But strictly, `reorderTasks` updates `order` field.

    const activeTasks = tasks.filter(t => !t.isDeleted);
    const incompleteTasks = activeTasks.filter(t => !t.isCompleted);
    const completedTasks = activeTasks.filter(t => t.isCompleted);

    // Sort by order locally just in case (though db.orderBy should handle it if consistent)
    // Actually tasks from useTasks are sorted by order because we used `orderBy('order')` in hook.

    return (
        <div className="page-content">
            <header className="page-header">
                <h1>インボックス</h1>
                <p className="subtitle">{format(new Date(), 'yyyy年 M月 d日 (eeee)', { locale: ja })}</p>
            </header>

            <div className="task-container">
                <TaskEditor onAdd={(title, lid, dueDate) => addTask({
                    title,
                    isCompleted: false,
                    priority: 'medium',
                    listId: lid,
                    dueDate
                })} />

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
