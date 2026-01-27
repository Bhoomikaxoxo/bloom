const { z } = require('zod');

const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    done: z.boolean().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    dueDate: z.string().optional().nullable(),
    noteId: z.string().uuid().optional().nullable(),
    source: z.enum(['STANDALONE', 'NOTE']).optional(),
    sourceId: z.string().optional().nullable()
});

const updateTaskSchema = z.object({
    title: z.string().optional(),
    done: z.boolean().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    dueDate: z.string().optional().nullable()
});

const syncTasksSchema = z.object({
    tasks: z.array(z.object({
        sourceId: z.string(),
        title: z.string(),
        done: z.boolean()
    }))
});

module.exports = {
    createTaskSchema,
    updateTaskSchema,
    syncTasksSchema
};
