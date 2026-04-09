const express = require('express');
const router = express.Router();
const { getWorks, createWork } = require('../controllers/workController');
const verifyToken = require('../middlewares/auth');
const { validateWorkInput } = require('../middlewares/validate');
const upload = require('../utils/upload');

router.get('/', getWorks);
router.post('/', verifyToken, upload.single('image'), validateWorkInput, createWork);

module.exports = router;