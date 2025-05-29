const express = require('express');
const user = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware');
//router onject
const router = express.Router();

//routes
router.post('/register', user.register);
router.post('/login', user.login);
router.post('/getUserData', authMiddleware, user.getUserData);
router.put('/updateUser', authMiddleware, user.updateUser);
module.exports = router;