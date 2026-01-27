const express = require('express');
const router = express.Router();
const controller = require('../controllers/foldersAndTags.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.post('/', controller.createFolder);
router.get('/', controller.getFolders);
router.put('/:id', controller.updateFolder);
router.delete('/:id', controller.deleteFolder);

module.exports = router;
