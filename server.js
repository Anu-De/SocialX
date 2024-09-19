require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const path = require('path');
const solc = require('solc');


const app = express();
const port = 3000;

// Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'client/public' directory
app.use(express.static(path.join(__dirname, 'Frontend', 'public')));


// Serve static files from the 'client/src' directory
app.use('/src', express.static(path.join(__dirname, 'Frontend', 'src')));

// app.use(express.static(path.join(__dirname, './client')));


// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'Frontend', 'public', 'login-form.html'));
});


app.listen(port, () => {
    console.log("Server is running on port " + port);
});


