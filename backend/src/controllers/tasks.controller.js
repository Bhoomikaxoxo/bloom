const tasksService = require('../services/tasks.service');
const {
    createTaskSchema,
    updateTaskSchema,
    syncTasksSchema
} = require('../validators/tasks.validators');

const createTask = async (req, res, next) => {
    try {
        const validatedData = createTaskSchema.parse(req.body);
        const task = await tasksService.createTask(req.user.id, validatedData);

        res.status(201).json({
            success: true,
            data: task
        });
    } catch (error) {
        next(error);
    }
};

const getTasks = async (req, res, next) => {
    try {
        const tasks = await tasksService.getTasks(req.user.id, req.query);

        res.json({
            success: true,
            data: tasks
        });
    } catch (error) {
        next(error);
    }
};

const getTaskById = async (req, res, next) => {
    try {
        const task = await tasksService.getTaskById(req.params.id, req.user.id);

        res.json({
            success: true,
            data: task
        });
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    try {
        console.log(`[DEBUG] updateTask called for ID: ${req.params.id}`);
        console.log(`[DEBUG] Request Body:`, JSON.stringify(req.body));

        const validatedData = updateTaskSchema.parse(req.body);
        console.log(`[DEBUG] Validated Data:`, JSON.stringify(validatedData));

        const task = await tasksService.updateTask(req.params.id, req.user.id, validatedData);
        console.log(`[DEBUG] Task Updated Successfully:`, task);

        res.json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error(`[DEBUG] updateTask FAILED:`, error);
        next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        const result = await tasksService.deleteTask(req.params.id, req.user.id);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const syncNoteTasks = async (req, res, next) => {
    try {
        const validatedData = syncTasksSchema.parse(req.body);
        const tasks = await tasksService.syncNoteTasks(
            req.params.noteId,
            req.user.id,
            validatedData.tasks
        );

        res.json({
            success: true,
            data: tasks
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    syncNoteTasks
};
