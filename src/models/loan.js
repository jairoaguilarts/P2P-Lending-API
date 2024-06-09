const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  id: Number,
  borrower: String,
  lender: String,
  amount: Number,
  interest: Number,
  duration: Number,
  isFunded: Boolean,
  isRepaid: Boolean
});

const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;
