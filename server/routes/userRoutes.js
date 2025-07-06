const express = require('express');
const router = express.Router();
const { getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.get('/', protect, restrictTo('admin'), getUsers);
router.put('/:id', protect, restrictTo('admin'), updateUser);
router.delete('/:id', protect, restrictTo('admin'), deleteUser);

module.exports = router;