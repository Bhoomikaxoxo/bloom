const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

// Create note
const createNote = async (userId, data) => {
    const note = await prisma.note.create({
        data: {
            title: data.title || 'Untitled',
            content: data.content || {},
            userId,
            folderId: data.folderId || null
        },
        include: {
            folder: true,
            tags: {
                include: {
                    tag: true
                }
            }
        }
    });

    return note;
};

// Get all notes for user
const getNotes = async (userId, filters = {}) => {
    const where = {
        userId,
        deletedAt: null // Only active notes by default
    };

    if (filters.folderId) {
        where.folderId = filters.folderId;
    }

    if (filters.tagId) {
        where.tags = {
            some: {
                tagId: filters.tagId
            }
        };
    }

    if (filters.isPinned !== undefined) {
        where.isPinned = filters.isPinned === 'true';
    }

    if (filters.isFavorite !== undefined) {
        where.isFavorite = filters.isFavorite === 'true';
    }

    if (filters.search) {
        where.OR = [
            { title: { contains: filters.search, mode: 'insensitive' } },
            // For JSON search, we'll use a simple approach
            // In production, consider adding a separate searchable text field
        ];
    }

    const notes = await prisma.note.findMany({
        where,
        include: {
            folder: true,
            tags: {
                include: {
                    tag: true
                }
            }
        },
        orderBy: [
            { isPinned: 'desc' },
            { updatedAt: 'desc' }
        ]
    });

    return notes;
};

// Get trash notes
const getTrashedNotes = async (userId) => {
    const notes = await prisma.note.findMany({
        where: {
            userId,
            deletedAt: { not: null }
        },
        include: {
            folder: true,
            tags: {
                include: {
                    tag: true
                }
            }
        },
        orderBy: {
            deletedAt: 'desc'
        }
    });

    return notes;
};

// Get single note
const getNoteById = async (noteId, userId) => {
    const note = await prisma.note.findFirst({
        where: {
            id: noteId,
            userId
        },
        include: {
            folder: true,
            tags: {
                include: {
                    tag: true
                }
            },
            linkedTasks: true
        }
    });

    if (!note) {
        throw new AppError('Note not found', 404);
    }

    return note;
};

// Update note
const updateNote = async (noteId, userId, data) => {
    // Verify ownership
    const existingNote = await prisma.note.findFirst({
        where: { id: noteId, userId }
    });

    if (!existingNote) {
        throw new AppError('Note not found', 404);
    }

    // Create version if content changed
    if (data.content && JSON.stringify(data.content) !== JSON.stringify(existingNote.content)) {
        // Save version (keep last 5)
        const versions = await prisma.noteVersion.findMany({
            where: { noteId },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        // If we have 5 versions, delete the oldest
        if (versions.length >= 5) {
            await prisma.noteVersion.delete({
                where: { id: versions[4].id }
            });
        }

        // Create new version
        await prisma.noteVersion.create({
            data: {
                noteId,
                content: existingNote.content
            }
        });
    }

    // Update note
    const note = await prisma.note.update({
        where: { id: noteId },
        data: {
            ...(data.title !== undefined && { title: data.title }),
            ...(data.content !== undefined && { content: data.content }),
            ...(data.isPinned !== undefined && { isPinned: data.isPinned }),
            ...(data.isFavorite !== undefined && { isFavorite: data.isFavorite }),
            ...(data.folderId !== undefined && { folderId: data.folderId }),
            ...(data.deletedAt !== undefined && { deletedAt: data.deletedAt })
        },
        include: {
            folder: true,
            tags: {
                include: {
                    tag: true
                }
            }
        }
    });

    return note;
};

// Delete note (soft delete)
const deleteNote = async (noteId, userId) => {
    const note = await prisma.note.findFirst({
        where: { id: noteId, userId }
    });

    if (!note) {
        throw new AppError('Note not found', 404);
    }

    // If already trashed, permanently delete
    if (note.deletedAt) {
        await prisma.note.delete({
            where: { id: noteId }
        });
        return { message: 'Note permanently deleted' };
    }

    // Soft delete
    await prisma.note.update({
        where: { id: noteId },
        data: { deletedAt: new Date() }
    });

    return { message: 'Note moved to trash' };
};

// Restore note
const restoreNote = async (noteId, userId) => {
    const note = await prisma.note.findFirst({
        where: { id: noteId, userId }
    });

    if (!note) {
        throw new AppError('Note not found', 404);
    }

    await prisma.note.update({
        where: { id: noteId },
        data: { deletedAt: null }
    });

    return { message: 'Note restored' };
};

// Get note versions
const getNoteVersions = async (noteId, userId) => {
    // Verify ownership
    const note = await prisma.note.findFirst({
        where: { id: noteId, userId }
    });

    if (!note) {
        throw new AppError('Note not found', 404);
    }

    const versions = await prisma.noteVersion.findMany({
        where: { noteId },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    return versions;
};

// Restore version
const restoreVersion = async (noteId, versionId, userId) => {
    // Verify ownership
    const note = await prisma.note.findFirst({
        where: { id: noteId, userId }
    });

    if (!note) {
        throw new AppError('Note not found', 404);
    }

    const version = await prisma.noteVersion.findUnique({
        where: { id: versionId }
    });

    if (!version || version.noteId !== noteId) {
        throw new AppError('Version not found', 404);
    }

    // Save current as version before restoring
    const versions = await prisma.noteVersion.findMany({
        where: { noteId },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    if (versions.length >= 5) {
        await prisma.noteVersion.delete({
            where: { id: versions[4].id }
        });
    }

    await prisma.noteVersion.create({
        data: {
            noteId,
            content: note.content
        }
    });

    // Restore version
    await prisma.note.update({
        where: { id: noteId },
        data: { content: version.content }
    });

    return { message: 'Version restored' };
};

// Add tag to note
const addTagToNote = async (noteId, tagId, userId) => {
    // Verify note ownership
    const note = await prisma.note.findFirst({
        where: { id: noteId, userId }
    });

    if (!note) {
        throw new AppError('Note not found', 404);
    }

    // Verify tag ownership
    const tag = await prisma.tag.findFirst({
        where: { id: tagId, userId }
    });

    if (!tag) {
        throw new AppError('Tag not found', 404);
    }

    // Check if already exists
    const existing = await prisma.noteTag.findUnique({
        where: {
            noteId_tagId: {
                noteId,
                tagId
            }
        }
    });

    if (existing) {
        return { message: 'Tag already added' };
    }

    // Create relationship
    await prisma.noteTag.create({
        data: {
            noteId,
            tagId
        }
    });

    return { message: 'Tag added to note' };
};

// Remove tag from note
const removeTagFromNote = async (noteId, tagId, userId) => {
    // Verify note ownership
    const note = await prisma.note.findFirst({
        where: { id: noteId, userId }
    });

    if (!note) {
        throw new AppError('Note not found', 404);
    }

    // Remove relationship
    await prisma.noteTag.deleteMany({
        where: {
            noteId,
            tagId
        }
    });

    return { message: 'Tag removed from note' };
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
    restoreVersion,
    addTagToNote,
    removeTagFromNote
};
