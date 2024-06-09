const Loan = require('../models/loan');

// Crear un nuevo préstamo
exports.createLoan = async (req, res) => {
    const loanData = req.body;

    try {
        const newLoan = new Loan(loanData);
        await newLoan.save();
        res.status(201).send(newLoan);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Obtener todos los préstamos
exports.getLoans = async (req, res) => {
    try {
        const loans = await Loan.find();
        res.status(200).send(loans);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Obtener un préstamo por ID
exports.getLoanById = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        if (!loan) {
            return res.status(404).send('Loan not found');
        }
        res.status(200).send(loan);
    } catch (error) {
        res.status(400).send(error);
    }
};
