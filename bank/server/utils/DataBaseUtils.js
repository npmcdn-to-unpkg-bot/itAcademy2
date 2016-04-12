import mongoose from "mongoose";

import '../models/Account';

const Account = mongoose.model('Account');

export function setUpConnection() {
    mongoose.connect('mongodb://elifuser:qwerty12@ds015710.mlab.com:15710/elifbankdb');
}

export function listAccounts(callback) {
    console.log('hit2')
    console.log(Account)
    Account.find({}, (err, data)=>{
        console.log(data);
        callback(data)
    });
}

export function createAccount(data) {
    const account = new Account({
        login: data.login,
        password: data.password,
        amount: data.amount
    });

    return account.save();
}

export function checkBalance(data) {

}

export function checkOperation(data) {

}

export function deleteAccount(id) {
    return Account.findById(id).remove();
}