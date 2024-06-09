const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const loanController = require('../controllers/loanController');

router.post('/register', authController.registerUser);
router.post('/login', authController.login);

router.post('/createLoan', loanController.createLoan);
router.get('/getLoans', loanController.getLoans);
router.get('/getLoan/:id', loanController.getLoanById);

router.get('/', homeController.home);

module.exports = router;
