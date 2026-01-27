const { z } = require('zod');

const createNoteSchema = z.object({
    title: z.string().optional(),
    content: z.any().optional(), // JSON content
    folderId: z.string().uuid().optional().nullable()
});

const updateNoteSchema = z.object({
    title: z.string().optional(),
    content: z.any().optional(),
    isPinned: z.boolean().optional(),
    isFavorite: z.boolean().optional(),
    folderId: z.string().uuid().optional().nullable()
});

const restoreVersionSchema = z.object({
    versionId: z.string().uuid()
});

module.exports = {
    createNoteSchema,
    updateNoteSchema,
    restoreVersionSchema
};
