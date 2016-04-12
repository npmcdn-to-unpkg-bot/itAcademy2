import express from 'express';
import bodyParser from 'body-parser';

import * as db from './utils/DataBaseUtils';

const app = express();

db.setUpConnection();

app.use(bodyParser.json() );

app.get('/accounts', (req, res) => {
    console.log('hit');
    db.listAccounts((data) => {
        res.send(data)
    });
});

app.post('/accounts', (req, res) => {
    db.createAccount(req.body).then(data => res.send(data));
});

app.delete('/accounts/:id', (req, res) => {
    db.deleteAccount(req.params.id).then(data => res.send(data));
});

const server = app.listen(8080, () => {
        console.log("Server is up and running on port 8080");
    });