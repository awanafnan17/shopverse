const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['stripe', 'cod'], required: true },
    transactionId: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
