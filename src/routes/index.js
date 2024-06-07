const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');

router.post('/register', authController.registerUser);
router.post('/login', authController.login);

router.get('/', homeController.home);

module.exports = router;
