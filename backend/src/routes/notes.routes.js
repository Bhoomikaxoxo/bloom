const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notes.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// CRUD routes
router.post('/', notesController.createNote);
router.get('/', notesController.getNotes);
router.get('/trash', notesController.getTrashedNotes);
router.get('/:id', notesController.getNoteById);
router.put('/:id', notesController.updateNote);
router.delete('/:id', notesController.deleteNote);

// Restore
router.post('/:id/restore', notesController.restoreNote);

// Versions
router.get('/:id/versions', notesController.getNoteVersions);
router.post('/:id/versions/restore', notesController.restoreVersion);

module.exports = router;
