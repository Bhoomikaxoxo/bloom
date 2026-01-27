const notesService = require('../services/notes.service');
const {
    createNoteSchema,
    updateNoteSchema,
    restoreVersionSchema
} = require('../validators/notes.validators');

// Create note
const createNote = async (req, res, next) => {
    try {
        const validatedData = createNoteSchema.parse(req.body);
        const note = await notesService.createNote(req.user.id, validatedData);

        res.status(201).json({
            success: true,
            data: note
        });
    } catch (error) {
        next(error);
    }
};

// Get all notes
const getNotes = async (req, res, next) => {
    try {
        const notes = await notesService.getNotes(req.user.id, req.query);

        res.json({
            success: true,
            data: notes
        });
    } catch (error) {
        next(error);
    }
};

// Get trashed notes
const getTrashedNotes = async (req, res, next) => {
    try {
        const notes = await notesService.getTrashedNotes(req.user.id);

        res.json({
            success: true,
            data: notes
        });
    } catch (error) {
        next(error);
    }
};

// Get single note
const getNoteById = async (req, res, next) => {
    try {
        const note = await notesService.getNoteById(req.params.id, req.user.id);

        res.json({
            success: true,
            data: note
        });
    } catch (error) {
        next(error);
    }
};

// Update note
const updateNote = async (req, res, next) => {
    try {
        const validatedData = updateNoteSchema.parse(req.body);
        const note = await notesService.updateNote(req.params.id, req.user.id, validatedData);

        res.json({
            success: true,
            data: note
        });
    } catch (error) {
        next(error);
    }
};

// Delete note
const deleteNote = async (req, res, next) => {
    try {
        const result = await notesService.deleteNote(req.params.id, req.user.id);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// Restore note
const restoreNote = async (req, res, next) => {
    try {
        const result = await notesService.restoreNote(req.params.id, req.user.id);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// Get note versions
const getNoteVersions = async (req, res, next) => {
    try {
        const versions = await notesService.getNoteVersions(req.params.id, req.user.id);

        res.json({
            success: true,
            data: versions
        });
    } catch (error) {
        next(error);
    }
};

// Restore version
const restoreVersion = async (req, res, next) => {
    try {
        const validatedData = restoreVersionSchema.parse(req.body);
        const result = await notesService.restoreVersion(
            req.params.id,
            validatedData.versionId,
            req.user.id
        );

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createNote,
    getNotes,
    getTrashedNotes,
    getNoteById,
    updateNote,
    deleteNote,
    restoreNote,
    getNoteVersions,
    restoreVersion
};
