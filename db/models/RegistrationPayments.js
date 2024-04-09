const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RegistrationPaymentsSchema = new Schema({
  student_id: {
    type: Number,
    required: true,
  },
  payment_intent: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  payment_status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(
  'RegistrationPayments',
  RegistrationPaymentsSchema
);
