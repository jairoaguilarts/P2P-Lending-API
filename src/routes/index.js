const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const loanController = require('../controllers/loanController');

router.post('/register', authController.registerUser);
router.post('/login', authController.login);

router.post('/createLoan', loanController.createLoan);
router.delete('/deleteLoan/:id', loanController.deleteLoan);
router.get('/getLoansByLender', loanController.getLoansByLender);
router.get('/getLoansByBorrower', loanController.getLoansByBorrower);
router.get('/getLoanById/:loanID', loanController.getLoanById);
router.get('/getLender/:walletAddress', loanController.getLender);
router.get('/getBorrower/:walletAddress', loanController.getBorrower);
router.put('/asignarLender', loanController.asignarLender);
router.put('/asignarBorrower', loanController.asignarBorrower);
router.put('/actualizarStatus', loanController.actualizarStatus);

router.get('/', homeController.home);

module.exports = router;
