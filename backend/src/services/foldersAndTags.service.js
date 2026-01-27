const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

// Folders
const createFolder = async (userId, name) => {
    try {
        const folder = await prisma.folder.create({
            data: {
                name,
                userId
            }
        });
        return folder;
    } catch (error) {
        if (error.code === 'P2002') {
            throw new AppError('Folder with this name already exists', 400);
        }
        throw error;
    }
};

const getFolders = async (userId) => {
    const folders = await prisma.folder.findMany({
        where: { userId },
        include: {
            _count: {
                select: { notes: true }
            }
        },
        orderBy: { createdAt: 'asc' }
    });
    return folders;
};

const updateFolder = async (folderId, userId, name) => {
    const folder = await prisma.folder.findFirst({
        where: { id: folderId, userId }
    });

    if (!folder) {
        throw new AppError('Folder not found', 404);
    }

    try {
        const updated = await prisma.folder.update({
            where: { id: folderId },
            data: { name }
        });
        return updated;
    } catch (error) {
        if (error.code === 'P2002') {
            throw new AppError('Folder with this name already exists', 400);
        }
        throw error;
    }
};

const deleteFolder = async (folderId, userId) => {
    const folder = await prisma.folder.findFirst({
        where: { id: folderId, userId }
    });

    if (!folder) {
        throw new AppError('Folder not found', 404);
    }

    // Notes will be set to folderId = null due to cascade
    await prisma.folder.delete({
        where: { id: folderId }
    });

    return { message: 'Folder deleted' };
};

// Tags
const createTag = async (userId, name, color) => {
    try {
        const tag = await prisma.tag.create({
            data: {
                name,
                color: color || 'blue',
                userId
            }
        });
        return tag;
    } catch (error) {
        if (error.code === 'P2002') {
            throw new AppError('Tag with this name already exists', 400);
        }
        throw error;
    }
};

const getTags = async (userId) => {
    const tags = await prisma.tag.findMany({
        where: { userId },
        include: {
            _count: {
                select: { notes: true, tasks: true }
            }
        },
        orderBy: { name: 'asc' }
    });
    return tags;
};

const updateTag = async (tagId, userId, data) => {
    const tag = await prisma.tag.findFirst({
        where: { id: tagId, userId }
    });

    if (!tag) {
        throw new AppError('Tag not found', 404);
    }

    try {
        const updated = await prisma.tag.update({
            where: { id: tagId },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.color !== undefined && { color: data.color })
            }
        });
        return updated;
    } catch (error) {
        if (error.code === 'P2002') {
            throw new AppError('Tag with this name already exists', 400);
        }
        throw error;
    }
};

const deleteTag = async (tagId, userId) => {
    const tag = await prisma.tag.findFirst({
        where: { id: tagId, userId }
    });

    if (!tag) {
        throw new AppError('Tag not found', 404);
    }

    await prisma.tag.delete({
        where: { id: tagId }
    });

    return { message: 'Tag deleted' };
};

module.exports = {
    createFolder,
    getFolders,
    updateFolder,
    deleteFolder,
    createTag,
    getTags,
    updateTag,
    deleteTag
};
