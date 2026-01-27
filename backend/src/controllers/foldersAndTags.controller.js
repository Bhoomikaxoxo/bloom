const foldersAndTagsService = require('../services/foldersAndTags.service');
const { z } = require('zod');

// Folders
const createFolder = async (req, res, next) => {
    try {
        const schema = z.object({ name: z.string().min(1) });
        const { name } = schema.parse(req.body);
        const folder = await foldersAndTagsService.createFolder(req.user.id, name);
        res.status(201).json({ success: true, data: folder });
    } catch (error) {
        next(error);
    }
};

const getFolders = async (req, res, next) => {
    try {
        const folders = await foldersAndTagsService.getFolders(req.user.id);
        res.json({ success: true, data: folders });
    } catch (error) {
        next(error);
    }
};

const updateFolder = async (req, res, next) => {
    try {
        const schema = z.object({ name: z.string().min(1) });
        const { name } = schema.parse(req.body);
        const folder = await foldersAndTagsService.updateFolder(req.params.id, req.user.id, name);
        res.json({ success: true, data: folder });
    } catch (error) {
        next(error);
    }
};

const deleteFolder = async (req, res, next) => {
    try {
        const result = await foldersAndTagsService.deleteFolder(req.params.id, req.user.id);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

// Tags
const createTag = async (req, res, next) => {
    try {
        const schema = z.object({
            name: z.string().min(1),
            color: z.string().optional()
        });
        const { name, color } = schema.parse(req.body);
        const tag = await foldersAndTagsService.createTag(req.user.id, name, color);
        res.status(201).json({ success: true, data: tag });
    } catch (error) {
        next(error);
    }
};

const getTags = async (req, res, next) => {
    try {
        const tags = await foldersAndTagsService.getTags(req.user.id);
        res.json({ success: true, data: tags });
    } catch (error) {
        next(error);
    }
};

const updateTag = async (req, res, next) => {
    try {
        const schema = z.object({
            name: z.string().optional(),
            color: z.string().optional()
        });
        const data = schema.parse(req.body);
        const tag = await foldersAndTagsService.updateTag(req.params.id, req.user.id, data);
        res.json({ success: true, data: tag });
    } catch (error) {
        next(error);
    }
};

const deleteTag = async (req, res, next) => {
    try {
        const result = await foldersAndTagsService.deleteTag(req.params.id, req.user.id);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
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
