const { client } = require('../config/db');

exports.createLoan = async (req, res) => {
    const loanData = req.body;

    try {
        // Conectar a la base de datos de MongoDB
        const database = client.db('microfinance-P2P');
        const loansCollection = database.collection('loans');

        const lastLoan = await loansCollection.find().sort({ loanID: -1 }).limit(1).toArray();

        const newLoanID = lastLoan.length > 0 ? lastLoan[0].loanID + 1 : 0;
        const newLoan = {
            loanID: newLoanID,
            amount: loanData.amount,
            interestRate: loanData.interestRate,
            duration: loanData.duration,
            status: 'Pending',
            lender: loanData.lender,
            borrower: loanData.borrower || null,
            isFunded: loanData.isFunded || false,
            isRepaid: loanData.isRepaid || false,
            createdAt: new Date()
        };

        await loansCollection.insertOne(newLoan);

        res.status(201).send(newLoan);
    } catch (error) {
        res.status(400).send({ message: 'Error creating loan offer', error: error.message });
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
