const express = require('express');
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/user');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();


/* Middleware apply all the routes
=========================== */
router.use(protect);
router.use(authorize('admin'));


/* User Endpoints
=========================== */
router
    .route('/')
    .get(getUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;