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
            lender: loanData.lender || null,
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

exports.deleteLoan = async (req, res) => {
    const loanID = parseInt(req.params.id, 10);

    try {
        // Conectar a la base de datos de MongoDB
        const database = client.db('microfinance-P2P');
        const loansCollection = database.collection('loans');

        const result = await loansCollection.deleteOne({ loanID: loanID });

        if (result.deletedCount === 1) {
            res.status(200).send({ message: 'Loan offer deleted successfully' });
        } else {
            res.status(404).send({ message: 'Loan offer not found' });
        }
    } catch (error) {
        res.status(400).send({ message: 'Error deleting loan offer', error: error.message });
    }
};

// Obtiene todos los contratos que tienen un lender
exports.getLoansByLender = async (req, res) => {
    const userWalletAddress = req.query.walletAddress;

    if (!userWalletAddress) {
        return res.status(400).json({ message: 'La dirección de la billetera es necesaria' });
    }

    try {
        // Conectar a la base de datos de MongoDB
        const database = client.db('microfinance-P2P');
        const loansCollection = database.collection('loans');
        const loans = await loansCollection.find({ lender: { $ne: null } }).toArray();
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los préstamos', error: error.message });
    }
};


// Obtiene todos los contratos que tienen un borrower, excluyendo los del usuario actual
exports.getLoansByBorrower = async (req, res) => {
    const userWalletAddress = req.query.walletAddress;

    if (!userWalletAddress) {
        return res.status(400).json({ message: 'La dirección de la billetera es necesaria' });
    }

    try {
        // Conectar a la base de datos de MongoDB
        const database = client.db('microfinance-P2P');
        const loansCollection = database.collection('loans');
        const loans = await loansCollection.find({ borrower: { $ne: null } }).toArray();
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los préstamos', error: error.message });
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
