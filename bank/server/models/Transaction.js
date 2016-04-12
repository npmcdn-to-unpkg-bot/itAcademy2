import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    login: {type: String},
    password: {type: String},
    amount: {type: Number}
});

const Transaction = mongoose.model('Transaction', TransactionSchema);/**
 * Created by Olexa on 12.04.2016.
 */
