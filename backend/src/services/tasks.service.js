const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

// Create task
const createTask = async (userId, data) => {
    const task = await prisma.task.create({
        data: {
            title: data.title,
            done: data.done || false,
            priority: data.priority || 'MEDIUM',
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
            userId,
            noteId: data.noteId || null,
            source: data.source || 'STANDALONE',
            sourceId: data.sourceId || null
        },
        include: {
            tags: {
                include: {
                    tag: true
                }
            },
            note: true
        }
    });

    return task;
};

// Get tasks
const getTasks = async (userId, filters = {}) => {
    const where = { userId };

    if (filters.done !== undefined) {
        where.done = filters.done === 'true';
    }

    if (filters.priority) {
        where.priority = filters.priority.toUpperCase();
    }

    if (filters.noteId) {
        where.noteId = filters.noteId;
    }

    if (filters.search) {
        where.title = { contains: filters.search, mode: 'insensitive' };
    }

    const tasks = await prisma.task.findMany({
        where,
        include: {
            tags: {
                include: {
                    tag: true
                }
            },
            note: {
                select: {
                    id: true,
                    title: true
                }
            }
        },
        orderBy: [
            { done: 'asc' },
            { dueDate: 'asc' },
            { createdAt: 'desc' }
        ]
    });

    return tasks;
};

// Get task by ID
const getTaskById = async (taskId, userId) => {
    const task = await prisma.task.findFirst({
        where: { id: taskId, userId },
        include: {
            tags: {
                include: {
                    tag: true
                }
            },
            note: true
        }
    });

    if (!task) {
        throw new AppError('Task not found', 404);
    }

    return task;
};

// Update task
const updateTask = async (taskId, userId, data) => {
    const existingTask = await prisma.task.findFirst({
        where: { id: taskId, userId }
    });

    if (!existingTask) {
        throw new AppError('Task not found', 404);
    }

    const task = await prisma.task.update({
        where: { id: taskId },
        data: {
            ...(data.title !== undefined && { title: data.title }),
            ...(data.done !== undefined && { done: data.done }),
            ...(data.priority !== undefined && { priority: data.priority }),
            ...(data.dueDate !== undefined && { dueDate: data.dueDate ? new Date(data.dueDate) : null })
        },
        include: {
            tags: {
                include: {
                    tag: true
                }
            },
            note: true
        }
    });

    return task;
};

// Delete task
const deleteTask = async (taskId, userId) => {
    const task = await prisma.task.findFirst({
        where: { id: taskId, userId }
    });

    if (!task) {
        throw new AppError('Task not found', 404);
    }

    await prisma.task.delete({
        where: { id: taskId }
    });

    return { message: 'Task deleted' };
};

// Bulk sync tasks for a note (for embedded tasks)
const syncNoteTasks = async (noteId, userId, tasks) => {
    // Verify note ownership
    const note = await prisma.note.findFirst({
        where: { id: noteId, userId }
    });

    if (!note) {
        throw new AppError('Note not found', 404);
    }

    // Get existing tasks for this note
    const existingTasks = await prisma.task.findMany({
        where: {
            userId,
            noteId,
            source: 'NOTE'
        }
    });

    const existingSourceIds = new Set(existingTasks.map(t => t.sourceId));
    const incomingSourceIds = new Set(tasks.map(t => t.sourceId));

    // Delete tasks that no longer exist
    const toDelete = existingTasks.filter(t => !incomingSourceIds.has(t.sourceId));
    for (const task of toDelete) {
        await prisma.task.delete({ where: { id: task.id } });
    }

    // Create or update tasks
    const results = [];
    for (const taskData of tasks) {
        const existing = existingTasks.find(t => t.sourceId === taskData.sourceId);

        if (existing) {
            // Update
            const updated = await prisma.task.update({
                where: { id: existing.id },
                data: {
                    title: taskData.title,
                    done: taskData.done
                }
            });
            results.push(updated);
        } else {
            // Create
            const created = await prisma.task.create({
                data: {
                    title: taskData.title,
                    done: taskData.done || false,
                    userId,
                    noteId,
                    source: 'NOTE',
                    sourceId: taskData.sourceId
                }
            });
            results.push(created);
        }
    }

    return results;
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    syncNoteTasks
};
