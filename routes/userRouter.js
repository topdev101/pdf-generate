const express = require('express');
const router = express.Router();
const { signUp, singIn, allUsers, deleteUser, updateUser, updateData } = require('../controllers/user')

router.post('/signup', signUp);
router.get('/login', singIn);
router.get('/users', allUsers);
router.delete('/delete/:id', deleteUser);
router.put('/data/:id', updateUser);
router.patch('/data', updateData)

module.exports = router;