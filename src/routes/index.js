const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const loanController = require('../controllers/loanController');

router.post('/register', authController.registerUser);
router.post('/login', authController.login);

router.post('/createLoan', loanController.createLoan);
router.get('/getLoansByLender/:walletAddress', loanController.getLoansByLender);
router.get('/getLoansByBorrower/:walletAddress', loanController.getLoansByBorrower);;

router.get('/', homeController.home);

module.exports = router;
