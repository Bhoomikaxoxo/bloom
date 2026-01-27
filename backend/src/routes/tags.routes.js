const express = require('express');
const router = express.Router();
const controller = require('../controllers/foldersAndTags.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.post('/', controller.createTag);
router.get('/', controller.getTags);
router.put('/:id', controller.updateTag);
router.delete('/:id', controller.deleteTag);

module.exports = router;
