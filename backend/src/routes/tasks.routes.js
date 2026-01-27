const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.post('/', tasksController.createTask);
router.get('/', tasksController.getTasks);
router.get('/:id', tasksController.getTaskById);
router.put('/:id', tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

// Sync embedded tasks for a note
router.post('/sync/:noteId', tasksController.syncNoteTasks);

module.exports = router;
