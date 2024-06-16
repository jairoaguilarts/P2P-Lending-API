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
            status: 'Pendiente',
            lender: loanData.lender || null,
            borrower: loanData.borrower || null,
            isFunded: loanData.isFunded || false,
            isRepaid: loanData.isRepaid || false,
            createdAt: new Date(),
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
        // Conectar a la base de datos de MongoDB
        const database = client.db('microfinance-P2P');
        const loansCollection = database.collection('loans');
        const loan = await loansCollection.findOne(req.params.loanID);
        if (!loan) {
            return res.status(404).send('Loan not found');
        }
        res.status(200).send(loan);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getLender = async (req, res) => {
    try {
        // Conectar a la base de datos de MongoDB
        const database = client.db('microfinance-P2P');
        const usersCollection = database.collection('users');
        const user = await usersCollection.findOne({ walletAddress: req.params.walletAddress });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getBorrower = async (req, res) => {
    try {
        // Conectar a la base de datos de MongoDB
        const database = client.db('microfinance-P2P');
        const usersCollection = database.collection('users');
        const user = await usersCollection.findOne({ walletAddress: req.params.walletAddress });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.asignarLender = async (req, res) => {
    const { loanID, lender } = req.body;

    if (loanID === undefined || loanID === null || !lender) {
        return res.status(400).send({ message: 'loanID y lender son requeridos' });
    }

    try {
        // Conectar a la base de datos de MongoDB
        const database = client.db('microfinance-P2P');
        const loansCollection = database.collection('loans');

        // Encontrar el préstamo por loanID y actualizar el campo lender
        const result = await loansCollection.findOneAndUpdate(
            { loanID: loanID },
            { $set: { lender: lender } },
            { returnOriginal: false, returnDocument: 'after' }
        );

        // Verificar si el prestamista fue asignado correctamente
        if (result && result.lender === lender) {
            res.status(200).send({ message: 'Prestamista asignado correctamente' });
        } else {
            res.status(404).send({ message: 'Préstamo no encontrado' });
        }
    } catch (error) {
        console.log('Error:', error);
        res.status(400).send({ message: 'Error updating loan', error: error.message });
    }
};

exports.asignarBorrower = async (req, res) => {
    const { loanID, borrower } = req.body;

    if (loanID === undefined || loanID === null || !borrower) {
        return res.status(400).send({ message: 'loanID y lender son requeridos' });
    }

    try {
        // Conectar a la base de datos de MongoDB
        const database = client.db('microfinance-P2P');
        const loansCollection = database.collection('loans');

        // Encontrar el préstamo por loanID y actualizar el campo lender
        const result = await loansCollection.findOneAndUpdate(
            { loanID: loanID },
            { $set: { borrower: borrower } },
            { returnOriginal: false, returnDocument: 'after' }
        );

        if (result && result.borrower === borrower) {
            res.status(200).send({ message: 'Prestamista asignado correctamente' });
        } else {
            res.status(404).send({ message: 'Préstamo no encontrado' });
        }
    } catch (error) {
        res.status(400).send({ message: 'Error updating loan', error: error.message });
    }
};

exports.actualizarStatus = async (req, res) => {
    const { loanID, isFunded, isRepaid, status } = req.body;

    if (!loanID) {
        return res.status(400).send({ message: 'loanID es requerido' });
    }

    try {
        // Conectar a la base de datos de MongoDB
        const database = client.db('microfinance-P2P');
        const loansCollection = database.collection('loans');

        // Crear un objeto de actualización
        const updateFields = {};
        if (typeof isFunded !== 'undefined') updateFields.isFunded = isFunded;
        if (typeof isRepaid !== 'undefined') updateFields.isRepaid = isRepaid;
        if (typeof status !== 'undefined') updateFields.status = status;

        // Encontrar el préstamo por loanID y actualizar los campos proporcionados
        const result = await loansCollection.findOneAndUpdate(
            { loanID: loanID },
            { $set: updateFields },
            { returnOriginal: false, returnDocument: 'after' }
        );

        if (result) {
            res.status(200).send({ message: 'Estado del préstamo actualizado correctamente', loan: result.value });
        } else {
            res.status(404).send({ message: 'Préstamo no encontrado' });
        }
    } catch (error) {
        res.status(400).send({ message: 'Error updating loan', error: error.message });
    }
};

